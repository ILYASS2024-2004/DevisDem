import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QuoteList.css';

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setQuotes([
        {
          id: 1,
          clientName: 'Jean Dupont',
          title: 'Déménagement appartement',
          totalAmount: 1500,
          status: 'pending',
          createdAt: '2024-03-15'
        },
        {
          id: 2,
          clientName: 'Marie Martin',
          title: 'Déménagement maison',
          totalAmount: 2500,
          status: 'confirmed',
          createdAt: '2024-03-14'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="quote-list">
      <div className="quote-list-header">
        <h1>Devis</h1>
        <Link to="/quotes/new" className="add-quote-button">
          Nouveau devis
        </Link>
      </div>

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmés</option>
            <option value="cancelled">Annulés</option>
            <option value="completed">Terminés</option>
          </select>
        </div>
      </div>

      <div className="quotes-table">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Titre</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map(quote => (
              <tr key={quote.id}>
                <td>{quote.clientName}</td>
                <td>{quote.title}</td>
                <td>{quote.totalAmount.toLocaleString('fr-FR')} €</td>
                <td>
                  <span className={getStatusBadgeClass(quote.status)}>
                    {getStatusLabel(quote.status)}
                  </span>
                </td>
                <td>{new Date(quote.createdAt).toLocaleDateString('fr-FR')}</td>
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

      {filteredQuotes.length === 0 && (
        <div className="no-results">
          Aucun devis trouvé
        </div>
      )}
    </div>
  );
};

export default QuoteList; 