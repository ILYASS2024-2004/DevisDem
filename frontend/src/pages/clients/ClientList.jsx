import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientService } from '../../services/api';
import './ClientList.css';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await clientService.getAll();
      setClients(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="client-list">
      <div className="client-list-header">
        <h1>Clients</h1>
        <Link to="/clients/new" className="add-client-button">
          Nouveau client
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="clients-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td>{client.firstName} {client.lastName}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.city}</td>
                <td>
                  <Link to={`/clients/${client.id}`} className="view-button">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredClients.length === 0 && (
        <div className="no-results">
          Aucun client trouvé
        </div>
      )}
    </div>
  );
};

export default ClientList; 