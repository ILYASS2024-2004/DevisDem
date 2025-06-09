const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const config = require('../config');

async function initializeDatabase() {
  let connection;

  try {
    // Connexion à MySQL sans spécifier de base de données
    connection = await mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password
    });

    console.log('Connexion à MySQL établie');

    // Lire le fichier SQL
    const sqlFile = await fs.readFile(
      path.join(__dirname, 'init.sql'),
      'utf8'
    );

    // Exécuter les commandes SQL
    const commands = sqlFile
      .split(';')
      .filter(command => command.trim())
      .map(command => command + ';');

    for (const command of commands) {
      await connection.query(command);
    }

    // Créer l'utilisateur admin avec un mot de passe hashé
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      `UPDATE users SET password = ? WHERE email = 'admin@devisdem.fr'`,
      [hashedPassword]
    );

    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Exécuter l'initialisation si le script est appelé directement
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = initializeDatabase; 