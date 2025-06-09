const { validationResult } = require('express-validator');

// Get all quotes
exports.getAllQuotes = async (req, res) => {
  try {
    const [quotes] = await req.db.query(`
      SELECT q.*, c.firstName, c.lastName, c.email 
      FROM quotes q 
      LEFT JOIN clients c ON q.clientId = c.id 
      ORDER BY q.createdAt DESC
    `);
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des devis' });
  }
};

// Get quote by ID
exports.getQuoteById = async (req, res) => {
  try {
    const [quotes] = await req.db.query(`
      SELECT q.*, c.firstName, c.lastName, c.email 
      FROM quotes q 
      LEFT JOIN clients c ON q.clientId = c.id 
      WHERE q.id = ?
    `, [req.params.id]);
    
    if (quotes.length === 0) {
      return res.status(404).json({ message: 'Devis non trouvé' });
    }

    // Récupérer les détails du devis
    const [details] = await req.db.query(
      'SELECT * FROM quote_details WHERE quoteId = ?',
      [req.params.id]
    );

    res.json({ ...quotes[0], details });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du devis' });
  }
};

// Create new quote
exports.createQuote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      clientId,
      title,
      description,
      totalAmount,
      status,
      startDate,
      endDate,
      details
    } = req.body;

    // Démarrer une transaction
    await req.db.beginTransaction();

    try {
      // Insérer le devis
      const [result] = await req.db.query(
        `INSERT INTO quotes (
          clientId, title, description, totalAmount, 
          status, startDate, endDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [clientId, title, description, totalAmount, status, startDate, endDate]
      );

      const quoteId = result.insertId;

      // Insérer les détails du devis
      if (details && details.length > 0) {
        const detailValues = details.map(detail => [
          quoteId,
          detail.description,
          detail.quantity,
          detail.unitPrice,
          detail.total
        ]);

        await req.db.query(
          `INSERT INTO quote_details (
            quoteId, description, quantity, unitPrice, total
          ) VALUES ?`,
          [detailValues]
        );
      }

      // Valider la transaction
      await req.db.commit();

      res.status(201).json({ 
        id: quoteId, 
        message: 'Devis créé avec succès' 
      });
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await req.db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ message: 'Erreur lors de la création du devis' });
  }
};

// Update quote
exports.updateQuote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      clientId,
      title,
      description,
      totalAmount,
      status,
      startDate,
      endDate,
      details
    } = req.body;

    // Démarrer une transaction
    await req.db.beginTransaction();

    try {
      // Mettre à jour le devis
      const [result] = await req.db.query(
        `UPDATE quotes SET 
          clientId = ?, title = ?, description = ?, 
          totalAmount = ?, status = ?, startDate = ?, 
          endDate = ?
        WHERE id = ?`,
        [clientId, title, description, totalAmount, status, startDate, endDate, req.params.id]
      );

      if (result.affectedRows === 0) {
        await req.db.rollback();
        return res.status(404).json({ message: 'Devis non trouvé' });
      }

      // Supprimer les anciens détails
      await req.db.query('DELETE FROM quote_details WHERE quoteId = ?', [req.params.id]);

      // Insérer les nouveaux détails
      if (details && details.length > 0) {
        const detailValues = details.map(detail => [
          req.params.id,
          detail.description,
          detail.quantity,
          detail.unitPrice,
          detail.total
        ]);

        await req.db.query(
          `INSERT INTO quote_details (
            quoteId, description, quantity, unitPrice, total
          ) VALUES ?`,
          [detailValues]
        );
      }

      // Valider la transaction
      await req.db.commit();

      res.json({ message: 'Devis mis à jour avec succès' });
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await req.db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du devis' });
  }
};

// Delete quote
exports.deleteQuote = async (req, res) => {
  try {
    // Démarrer une transaction
    await req.db.beginTransaction();

    try {
      // Supprimer les détails du devis
      await req.db.query('DELETE FROM quote_details WHERE quoteId = ?', [req.params.id]);

      // Supprimer le devis
      const [result] = await req.db.query('DELETE FROM quotes WHERE id = ?', [req.params.id]);

      if (result.affectedRows === 0) {
        await req.db.rollback();
        return res.status(404).json({ message: 'Devis non trouvé' });
      }

      // Valider la transaction
      await req.db.commit();

      res.json({ message: 'Devis supprimé avec succès' });
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await req.db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du devis' });
  }
};

// Get quotes by client
exports.getQuotesByClient = async (req, res) => {
  try {
    const [quotes] = await req.db.query(`
      SELECT q.*, c.firstName, c.lastName, c.email 
      FROM quotes q 
      LEFT JOIN clients c ON q.clientId = c.id 
      WHERE q.clientId = ?
      ORDER BY q.createdAt DESC
    `, [req.params.clientId]);
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching client quotes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des devis du client' });
  }
}; 