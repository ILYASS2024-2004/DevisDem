-- Création de la base de données
CREATE DATABASE IF NOT EXISTS devisdem;
USE devisdem;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des types de logements
CREATE TABLE IF NOT EXISTS logements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des statuts
CREATE TABLE IF NOT EXISTS status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#000000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address_departure TEXT NOT NULL,
    address_arrival TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des devis
CREATE TABLE IF NOT EXISTS quotes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    status_id INT NOT NULL,
    logement_id INT NOT NULL,
    volume DECIMAL(10,2) NOT NULL,
    formule VARCHAR(50) NOT NULL,
    date_type ENUM('fixe', 'flexible') NOT NULL,
    date_departure DATE,
    date_arrival DATE,
    price_ht DECIMAL(10,2) NOT NULL,
    tva DECIMAL(5,2) DEFAULT 20.00,
    price_ttc DECIMAL(10,2) NOT NULL,
    deposit DECIMAL(10,2) NOT NULL,
    remaining_balance DECIMAL(10,2) NOT NULL,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (status_id) REFERENCES status(id),
    FOREIGN KEY (logement_id) REFERENCES logements(id)
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quote_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_id) REFERENCES quotes(id)
);

-- Table des localisations
CREATE TABLE IF NOT EXISTS locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quote_id INT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address TEXT NOT NULL,
    type ENUM('departure', 'arrival') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_id) REFERENCES quotes(id)
);

-- Insertion des données de base pour les statuts
INSERT INTO status (name, color) VALUES
('En attente', '#FFA500'),
('Confirmé', '#008000'),
('Annulé', '#FF0000'),
('Terminé', '#0000FF');

-- Insertion des données de base pour les types de logements
INSERT INTO logements (name, description) VALUES
('Studio', 'Studio jusqu''à 30m²'),
('2 pièces', 'Appartement 2 pièces jusqu''à 45m²'),
('3 pièces', 'Appartement 3 pièces jusqu''à 60m²'),
('4 pièces', 'Appartement 4 pièces jusqu''à 80m²'),
('5 pièces et plus', 'Appartement 5 pièces et plus, plus de 80m²'),
('Maison', 'Maison individuelle'); 