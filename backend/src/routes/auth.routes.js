const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { body } = require('express-validator');

// Validation des données d'inscription
const registerValidation = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('first_name').notEmpty().withMessage('Le prénom est requis'),
    body('last_name').notEmpty().withMessage('Le nom est requis')
];

// Validation des données de connexion
const loginValidation = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis')
];

// Validation de la réinitialisation du mot de passe
const resetPasswordValidation = [
    body('email').isEmail().withMessage('Email invalide'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Code invalide'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', 
    body('email').isEmail().withMessage('Email invalide'),
    authController.forgotPassword
);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

module.exports = router; 