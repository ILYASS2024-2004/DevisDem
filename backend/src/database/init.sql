-- Création de la base de données
CREATE DATABASE IF NOT EXISTS devisdem;
USE devisdem;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postalCode VARCHAR(10),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des devis
CREATE TABLE IF NOT EXISTS quotes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  totalAmount DECIMAL(10,2) NOT NULL,
  status ENUM('draft', 'pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);

-- Table des détails des devis
CREATE TABLE IF NOT EXISTS quoteDetails (
  id INT PRIMARY KEY AUTO_INCREMENT,
  quoteId INT NOT NULL,
  description TEXT NOT NULL,
  quantity INT NOT NULL,
  unitPrice DECIMAL(10,2) NOT NULL,
  totalPrice DECIMAL(10,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quoteId) REFERENCES quotes(id) ON DELETE CASCADE
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  quoteId INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paymentMethod ENUM('cash', 'card', 'transfer', 'check') NOT NULL,
  paymentDate DATE NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  reference VARCHAR(100),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quoteId) REFERENCES quotes(id) ON DELETE CASCADE
);

-- Insertion d'un utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (email, password, firstName, lastName, role)
VALUES ('admin@devisdem.fr', '$2b$10$YourHashedPasswordHere', 'Admin', 'System', 'admin')
ON DUPLICATE KEY UPDATE id=id; 