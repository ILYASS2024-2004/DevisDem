const app = require('./app');
const config = require('./config/config');

const server = app.listen(3000, () => {
    console.log(`Serveur démarré sur le port ${config.server.port} en mode ${config.server.env}`);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
    console.error('Erreur non capturée:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Promesse rejetée non gérée:', err);
    server.close(() => {
        process.exit(1);
    });
}); 