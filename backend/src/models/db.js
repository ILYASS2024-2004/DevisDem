const mysql = require('mysql2/promise');
const config = require('../config/config');

// Création du pool de connexions
const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de la connexion
pool.getConnection()
    .then(connection => {
        console.log('Connexion à la base de données établie avec succès');
        connection.release();
    })
    .catch(err => {
        console.error('Erreur de connexion à la base de données:', err);
    });

module.exports = pool; 