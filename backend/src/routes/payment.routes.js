const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByQuote
} = require('../controllers/payment.controller');

const router = express.Router();

// Validation rules
const paymentValidation = [
  body('quoteId').isInt().withMessage('ID du devis invalide'),
  body('amount').isFloat({ min: 0 }).withMessage('Le montant doit être un nombre positif'),
  body('paymentMethod').isIn(['cash', 'card', 'transfer', 'check']).withMessage('Méthode de paiement invalide'),
  body('paymentDate').isISO8601().withMessage('Date de paiement invalide'),
  body('status').isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Statut invalide'),
  body('reference').optional().isString().withMessage('Référence invalide'),
  body('notes').optional().isString().withMessage('Notes invalides')
];

// Routes
router.get('/', authMiddleware, getAllPayments);
router.get('/quote/:quoteId', authMiddleware, getPaymentsByQuote);
router.get('/:id', authMiddleware, getPaymentById);
router.post('/', authMiddleware, paymentValidation, createPayment);
router.put('/:id', authMiddleware, paymentValidation, updatePayment);
router.delete('/:id', authMiddleware, deletePayment);

module.exports = router; 