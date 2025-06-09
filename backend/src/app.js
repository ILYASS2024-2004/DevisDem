const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const quoteRoutes = require('./routes/quote.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/payments', paymentRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Une erreur est survenue',
        error: config.server.env === 'development' ? err : {}
    });
});

// Route 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

module.exports = app; 