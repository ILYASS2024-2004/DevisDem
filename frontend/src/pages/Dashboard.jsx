import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { useStore } from '../store';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    completedQuotes: 0
  });

  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        totalClients: 25,
        totalQuotes: 45,
        pendingQuotes: 12,
        completedQuotes: 33
      });
      setRecentQuotes([
        {
          id: 1,
          clientName: 'Jean Dupont',
          date: '2024-03-15',
          amount: 1500,
          status: 'pending'
        },
        {
          id: 2,
          clientName: 'Marie Martin',
          date: '2024-03-14',
          amount: 2300,
          status: 'completed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <Link to="/clients/new" className="add-client-button">
          Nouveau client
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p className="stat-value">{stats.totalClients}</p>
        </div>
        <div className="stat-card">
          <h3>Total Devis</h3>
          <p className="stat-value">{stats.totalQuotes}</p>
        </div>
        <div className="stat-card">
          <h3>Devis en attente</h3>
          <p className="stat-value">{stats.pendingQuotes}</p>
        </div>
        <div className="stat-card">
          <h3>Devis complétés</h3>
          <p className="stat-value">{stats.completedQuotes}</p>
        </div>
      </div>

      <div className="recent-quotes">
        <h2>Devis récents</h2>
        <div className="quotes-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Statut</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map(quote => (
                <tr key={quote.id}>
                  <td>{quote.date}</td>
                  <td>{quote.clientName}</td>
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
  );
};

export default Dashboard; 