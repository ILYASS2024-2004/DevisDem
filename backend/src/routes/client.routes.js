const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const { getAllClients, getClientById, createClient, updateClient, deleteClient, searchClients } = require('../controllers/client.controller');

// Validation rules
const clientValidationRules = [
  body('firstName').trim().notEmpty().withMessage('Le prénom est requis'),
  body('lastName').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('postalCode').optional().trim(),
  body('country').optional().trim(),
  body('notes').optional().trim()
];

// Routes
router.get('/', authMiddleware, getAllClients);
router.get('/search', authMiddleware, searchClients);
router.get('/:id', authMiddleware, getClientById);
router.post('/', authMiddleware, clientValidationRules, createClient);
router.put('/:id', authMiddleware, clientValidationRules, updateClient);
router.delete('/:id', authMiddleware, deleteClient);

module.exports = router; 