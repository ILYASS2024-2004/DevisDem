import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ClientDetails.css';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setClient({
        id: id,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '0123456789',
        address: '123 rue de Paris',
        city: 'Paris',
        postalCode: '75001',
        notes: 'Client fidèle depuis 2020'
      });

      setQuotes([
        {
          id: 1,
          title: 'Déménagement appartement',
          date: '2024-03-15',
          amount: 1500,
          status: 'pending'
        },
        {
          id: 2,
          title: 'Déménagement bureau',
          date: '2024-02-20',
          amount: 2300,
          status: 'completed'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      // Simuler la suppression
      navigate('/clients');
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!client) {
    return <div className="error">Client non trouvé</div>;
  }

  return (
    <div className="client-details">
      <div className="client-header">
        <h1>{client.firstName} {client.lastName}</h1>
        <div className="client-actions">
          <Link to={`/clients/${id}/edit`} className="edit-button">
            Modifier
          </Link>
          <button onClick={handleDelete} className="delete-button">
            Supprimer
          </button>
        </div>
      </div>

      <div className="client-info">
        <div className="info-section">
          <h2>Informations de contact</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{client.email}</p>
            </div>
            <div className="info-item">
              <label>Téléphone</label>
              <p>{client.phone}</p>
            </div>
            <div className="info-item">
              <label>Adresse</label>
              <p>{client.address}</p>
            </div>
            <div className="info-item">
              <label>Ville</label>
              <p>{client.city}</p>
            </div>
            <div className="info-item">
              <label>Code postal</label>
              <p>{client.postalCode}</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Notes</h2>
          <p className="notes">{client.notes}</p>
        </div>

        <div className="info-section">
          <div className="section-header">
            <h2>Devis</h2>
            <Link to="/quotes/new" className="add-quote-button">
              Nouveau devis
            </Link>
          </div>
          <div className="quotes-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Montant</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(quote => (
                  <tr key={quote.id}>
                    <td>{quote.date}</td>
                    <td>{quote.title}</td>
                    <td>
                      <span className={`status-badge ${quote.status}`}>
                        {quote.status === 'pending' ? 'En attente' : 'Complété'}
                      </span>
                    </td>
                    <td>{quote.amount} €</td>
                    <td>
                      <Link to={`/quotes/${quote.id}`} className="view-button">
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails; 