const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  getQuotesByClient
} = require('../controllers/quote.controller');

// Validation rules
const quoteValidationRules = [
  body('clientId').isInt().withMessage('ID client invalide'),
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('description').optional().trim(),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Le montant total doit être un nombre positif'),
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Statut invalide'),
  body('startDate').optional().isISO8601().withMessage('Date de début invalide'),
  body('endDate').optional().isISO8601().withMessage('Date de fin invalide'),
  body('details').optional().isArray().withMessage('Les détails doivent être un tableau'),
  body('details.*.description').optional().trim(),
  body('details.*.quantity').optional().isFloat({ min: 0 }).withMessage('La quantité doit être un nombre positif'),
  body('details.*.unitPrice').optional().isFloat({ min: 0 }).withMessage('Le prix unitaire doit être un nombre positif'),
  body('details.*.total').optional().isFloat({ min: 0 }).withMessage('Le total doit être un nombre positif')
];

// Routes
router.get('/', authMiddleware, getAllQuotes);
router.get('/client/:clientId', authMiddleware, getQuotesByClient);
router.get('/:id', authMiddleware, getQuoteById);
router.post('/', authMiddleware, quoteValidationRules, createQuote);
router.put('/:id', authMiddleware, quoteValidationRules, updateQuote);
router.delete('/:id', authMiddleware, deleteQuote);

module.exports = router; 