const { validationResult } = require('express-validator');

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const [clients] = await req.db.query('SELECT * FROM clients ORDER BY createdAt DESC');
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des clients' });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  try {
    const [clients] = await req.db.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (clients.length === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    res.json(clients[0]);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du client' });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, phone, address, city, postalCode, country, notes } = req.body;
    const [result] = await req.db.query(
      'INSERT INTO clients (firstName, lastName, email, phone, address, city, postalCode, country, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone, address, city, postalCode, country, notes]
    );
    res.status(201).json({ id: result.insertId, message: 'Client créé avec succès' });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Erreur lors de la création du client' });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, phone, address, city, postalCode, country, notes } = req.body;
    const [result] = await req.db.query(
      'UPDATE clients SET firstName = ?, lastName = ?, email = ?, phone = ?, address = ?, city = ?, postalCode = ?, country = ?, notes = ? WHERE id = ?',
      [firstName, lastName, email, phone, address, city, postalCode, country, notes, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    res.json({ message: 'Client mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du client' });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du client' });
  }
};

// Search clients
exports.searchClients = async (req, res) => {
  try {
    const { query } = req.query;
    const [clients] = await req.db.query(
      'SELECT * FROM clients WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY createdAt DESC',
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );
    res.json(clients);
  } catch (error) {
    console.error('Error searching clients:', error);
    res.status(500).json({ message: 'Erreur lors de la recherche des clients' });
  }
}; 