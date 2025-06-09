import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuoteDetails.css';

const QuoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setQuote({
        id: 1,
        clientName: 'Jean Dupont',
        title: 'Déménagement appartement',
        description: 'Déménagement complet d\'un 3 pièces',
        totalAmount: 1500,
        status: 'pending',
        createdAt: '2024-03-15',
        items: [
          {
            description: 'Emballage',
            quantity: 1,
            unitPrice: 500,
            total: 500
          },
          {
            description: 'Transport',
            quantity: 1,
            unitPrice: 1000,
            total: 1000
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge pending';
      case 'confirmed':
        return 'status-badge confirmed';
      case 'cancelled':
        return 'status-badge cancelled';
      case 'completed':
        return 'status-badge completed';
      default:
        return 'status-badge';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmé';
      case 'cancelled':
        return 'Annulé';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      try {
        // Simuler la suppression
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/quotes');
      } catch (err) {
        setError('Une erreur est survenue lors de la suppression du devis');
        console.error('Error deleting quote:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!quote) {
    return <div className="not-found">Devis non trouvé</div>;
  }

  return (
    <div className="quote-details">
      <div className="quote-header">
        <div className="header-content">
          <h1>{quote.title}</h1>
          <span className={getStatusBadgeClass(quote.status)}>
            {getStatusLabel(quote.status)}
          </span>
        </div>
        <div className="header-actions">
          <button
            className="edit-button"
            onClick={() => navigate(`/quotes/${id}/edit`)}
          >
            Modifier
          </button>
          <button
            className="delete-button"
            onClick={handleDelete}
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="quote-info">
        <div className="info-section">
          <h2>Informations générales</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Client</label>
              <span>{quote.clientName}</span>
            </div>
            <div className="info-item">
              <label>Date de création</label>
              <span>{new Date(quote.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="info-item">
              <label>Montant total</label>
              <span>{quote.totalAmount.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Description</h2>
          <p>{quote.description}</p>
        </div>

        <div className="info-section">
          <h2>Éléments du devis</h2>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toLocaleString('fr-FR')} €</td>
                    <td>{item.total.toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="total-label">Total</td>
                  <td className="total-amount">
                    {quote.totalAmount.toLocaleString('fr-FR')} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails; 