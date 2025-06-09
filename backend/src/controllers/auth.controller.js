const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models/db');

const authController = {
    // Inscription
    async register(req, res) {
        try {
            const { email, password, first_name, last_name } = req.body;

            // Vérification si l'email existe déjà
            const [existingUser] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }

            // Hashage du mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Création de l'utilisateur
            const [result] = await db.query(
                'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
                [email, hashedPassword, first_name, last_name]
            );

            res.status(201).json({ message: 'Utilisateur créé avec succès' });
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        }
    },

    // Connexion
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Recherche de l'utilisateur
            const [users] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            const user = users[0];

            // Vérification du mot de passe
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Génération du token JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email,
                    role: user.role 
                },
                config.jwt.secret,
                { expiresIn: config.jwt.expiresIn }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({ message: 'Erreur lors de la connexion' });
        }
    },

    // Mot de passe oublié
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Vérification si l'email existe
            const [users] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(404).json({ message: 'Aucun compte associé à cet email' });
            }

            // Génération d'un code de vérification
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Stockage du code dans la base de données
            await db.query(
                'UPDATE users SET reset_code = ?, reset_code_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?',
                [verificationCode, email]
            );

            // TODO: Envoi de l'email avec le code
            // Pour l'instant, on renvoie le code dans la réponse
            res.json({ 
                message: 'Code de vérification envoyé',
                code: verificationCode // À retirer en production
            });
        } catch (error) {
            console.error('Erreur lors de la demande de réinitialisation:', error);
            res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
        }
    },

    // Réinitialisation du mot de passe
    async resetPassword(req, res) {
        try {
            const { email, code, newPassword } = req.body;

            // Vérification du code
            const [users] = await db.query(
                'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()',
                [email, code]
            );

            if (users.length === 0) {
                return res.status(400).json({ message: 'Code invalide ou expiré' });
            }

            // Hashage du nouveau mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Mise à jour du mot de passe
            await db.query(
                'UPDATE users SET password = ?, reset_code = NULL, reset_code_expires = NULL WHERE email = ?',
                [hashedPassword, email]
            );

            res.json({ message: 'Mot de passe réinitialisé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
        }
    }
};

module.exports = authController; 