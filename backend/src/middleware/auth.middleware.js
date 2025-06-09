const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Middleware d'authentification
const authMiddleware = async (req, res, next) => {
    try {
        // Récupérer le token du header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token d\'authentification manquant' });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Ajout des informations de l'utilisateur à la requête
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).json({ message: 'Token invalide' });
    }
};

// Middleware de vérification du rôle admin
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }
        next();
    } catch (error) {
        console.error('Error in admin middleware:', error);
        res.status(403).json({ message: 'Accès non autorisé' });
    }
};

module.exports = {
    authMiddleware,
    adminMiddleware
}; 