const { validationResult } = require('express-validator');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const [payments] = await req.db.query(`
      SELECT p.*, q.title as quoteTitle, c.firstName, c.lastName 
      FROM payments p
      LEFT JOIN quotes q ON p.quoteId = q.id
      LEFT JOIN clients c ON q.clientId = c.id
      ORDER BY p.createdAt DESC
    `);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const [payments] = await req.db.query(`
      SELECT p.*, q.title as quoteTitle, c.firstName, c.lastName 
      FROM payments p
      LEFT JOIN quotes q ON p.quoteId = q.id
      LEFT JOIN clients c ON q.clientId = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (payments.length === 0) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    res.json(payments[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du paiement' });
  }
};

// Create new payment
exports.createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      quoteId,
      amount,
      paymentMethod,
      paymentDate,
      status,
      reference,
      notes
    } = req.body;

    // Démarrer une transaction
    await req.db.beginTransaction();

    try {
      // Insérer le paiement
      const [result] = await req.db.query(
        `INSERT INTO payments (
          quoteId, amount, paymentMethod, paymentDate,
          status, reference, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [quoteId, amount, paymentMethod, paymentDate, status, reference, notes]
      );

      // Mettre à jour le statut du devis si nécessaire
      if (status === 'completed') {
        const [quote] = await req.db.query(
          'SELECT totalAmount FROM quotes WHERE id = ?',
          [quoteId]
        );

        if (quote.length > 0) {
          const totalPaid = await calculateTotalPaid(quoteId);
          if (totalPaid >= quote[0].totalAmount) {
            await req.db.query(
              'UPDATE quotes SET status = ? WHERE id = ?',
              ['completed', quoteId]
            );
          }
        }
      }

      // Valider la transaction
      await req.db.commit();

      res.status(201).json({
        id: result.insertId,
        message: 'Paiement créé avec succès'
      });
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await req.db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Erreur lors de la création du paiement' });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      quoteId,
      amount,
      paymentMethod,
      paymentDate,
      status,
      reference,
      notes
    } = req.body;

    // Démarrer une transaction
    await req.db.beginTransaction();

    try {
      // Mettre à jour le paiement
      const [result] = await req.db.query(
        `UPDATE payments SET 
          quoteId = ?, amount = ?, paymentMethod = ?,
          paymentDate = ?, status = ?, reference = ?,
          notes = ?
        WHERE id = ?`,
        [quoteId, amount, paymentMethod, paymentDate, status, reference, notes, req.params.id]
      );

      if (result.affectedRows === 0) {
        await req.db.rollback();
        return res.status(404).json({ message: 'Paiement non trouvé' });
      }

      // Mettre à jour le statut du devis si nécessaire
      if (status === 'completed') {
        const [quote] = await req.db.query(
          'SELECT totalAmount FROM quotes WHERE id = ?',
          [quoteId]
        );

        if (quote.length > 0) {
          const totalPaid = await calculateTotalPaid(quoteId);
          if (totalPaid >= quote[0].totalAmount) {
            await req.db.query(
              'UPDATE quotes SET status = ? WHERE id = ?',
              ['completed', quoteId]
            );
          }
        }
      }

      // Valider la transaction
      await req.db.commit();

      res.json({ message: 'Paiement mis à jour avec succès' });
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await req.db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du paiement' });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM payments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    res.json({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du paiement' });
  }
};

// Get payments by quote
exports.getPaymentsByQuote = async (req, res) => {
  try {
    const [payments] = await req.db.query(
      'SELECT * FROM payments WHERE quoteId = ? ORDER BY paymentDate DESC',
      [req.params.quoteId]
    );
    res.json(payments);
  } catch (error) {
    console.error('Error fetching quote payments:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements du devis' });
  }
};

// Helper function to calculate total paid amount for a quote
async function calculateTotalPaid(quoteId) {
  const [result] = await req.db.query(
    'SELECT SUM(amount) as total FROM payments WHERE quoteId = ? AND status = ?',
    [quoteId, 'completed']
  );
  return result[0].total || 0;
} 