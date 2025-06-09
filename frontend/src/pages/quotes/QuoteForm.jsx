import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './QuoteForm.css';

const QuoteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    totalAmount: '',
    status: 'pending',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: '',
        total: ''
      }
    ]
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simuler le chargement des clients
    setClients([
      { id: 1, name: 'Jean Dupont' },
      { id: 2, name: 'Marie Martin' }
    ]);

    if (isEditing) {
      // Simuler le chargement des données du devis
      setLoading(true);
      setTimeout(() => {
        setFormData({
          clientId: '1',
          title: 'Déménagement appartement',
          description: 'Déménagement complet d\'un 3 pièces',
          totalAmount: '1500',
          status: 'pending',
          items: [
            {
              description: 'Emballage',
              quantity: 1,
              unitPrice: '500',
              total: '500'
            },
            {
              description: 'Transport',
              quantity: 1,
              unitPrice: '1000',
              total: '1000'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Calculer le total de l'élément
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? value : newItems[index].unitPrice;
      newItems[index].total = (quantity * unitPrice).toString();
    }

    // Calculer le montant total
    const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: totalAmount.toString()
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          quantity: 1,
          unitPrice: '',
          total: ''
        }
      ]
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: totalAmount.toString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simuler l'envoi des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste des devis
      navigate('/quotes');
    } catch (err) {
      setError('Une erreur est survenue lors de l\'enregistrement du devis');
      console.error('Error saving quote:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="quote-form">
      <div className="form-header">
        <h1>{isEditing ? 'Modifier le devis' : 'Nouveau devis'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="clientId">Client</label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Statut</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="cancelled">Annulé</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="totalAmount">Montant total</label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
        </div>

        <div className="items-section">
          <div className="items-header">
            <h2>Éléments du devis</h2>
            <button
              type="button"
              className="add-item-button"
              onClick={addItem}
            >
              Ajouter un élément
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantité</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Prix unitaire</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Total</label>
                <input
                  type="number"
                  value={item.total}
                  readOnly
                />
              </div>

              <button
                type="button"
                className="remove-item-button"
                onClick={() => removeItem(index)}
                disabled={formData.items.length === 1}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/quotes')}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuoteForm; 