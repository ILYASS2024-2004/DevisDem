import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '../../services/api';
import '../../styles/ClientForm.css';

const ClientEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address_departure: '',
        address_arrival: '',
        volume: '',
        formule: 'standard',
        date_type: 'fixe',
        date_departure: '',
        date_arrival: '',
        logement_type: 'studio',
        price_ht: '',
        tva: '20',
        price_ttc: '',
        deposit: '',
        observations: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClient();
    }, [id]);

    const fetchClient = async () => {
        try {
            const response = await clientService.getById(id);
            const client = response.data;
            
            // Format dates for input fields
            const formatDateForInput = (dateString) => {
                return new Date(dateString).toISOString().split('T')[0];
            };

            setFormData({
                ...client,
                date_departure: formatDateForInput(client.date_departure),
                date_arrival: formatDateForInput(client.date_arrival)
            });
            setError('');
        } catch (error) {
            setError('Erreur lors du chargement du client');
            console.error('Error fetching client:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Calcul automatique du prix TTC
            if (name === 'price_ht' || name === 'tva') {
                const priceHT = name === 'price_ht' ? value : prev.price_ht;
                const tva = name === 'tva' ? value : prev.tva;
                newData.price_ttc = (parseFloat(priceHT) * (1 + parseFloat(tva) / 100)).toFixed(2);
            }

            // Calcul automatique des arrhes (30% du prix TTC)
            if (name === 'price_ttc') {
                newData.deposit = (parseFloat(value) * 0.3).toFixed(2);
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await clientService.update(id, formData);
            navigate(`/clients/${id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Une erreur est survenue');
        }
    };

    if (isLoading) {
        return <div className="loading">Chargement du client...</div>;
    }

    return (
        <div className="client-form-container">
            <h1>Modifier le Client</h1>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="client-form">
                {/* Informations du client */}
                <div className="form-section">
                    <h2>Informations du client</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="first_name">Prénom</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Nom</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Adresses */}
                <div className="form-section">
                    <h2>Adresses</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="address_departure">Adresse de départ</label>
                            <textarea
                                id="address_departure"
                                name="address_departure"
                                value={formData.address_departure}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address_arrival">Adresse d'arrivée</label>
                            <textarea
                                id="address_arrival"
                                name="address_arrival"
                                value={formData.address_arrival}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Détails du déménagement */}
                <div className="form-section">
                    <h2>Détails du déménagement</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="volume">Volume (m³)</label>
                            <input
                                type="number"
                                id="volume"
                                name="volume"
                                value={formData.volume}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="formule">Formule</label>
                            <select
                                id="formule"
                                name="formule"
                                value={formData.formule}
                                onChange={handleChange}
                            >
                                <option value="standard">Standard</option>
                                <option value="premium">Premium</option>
                                <option value="luxe">Luxe</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="logement_type">Type de logement</label>
                            <select
                                id="logement_type"
                                name="logement_type"
                                value={formData.logement_type}
                                onChange={handleChange}
                            >
                                <option value="studio">Studio</option>
                                <option value="2_pieces">2 pièces</option>
                                <option value="3_pieces">3 pièces</option>
                                <option value="4_pieces">4 pièces</option>
                                <option value="5_pieces">5 pièces et plus</option>
                                <option value="maison">Maison</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="form-section">
                    <h2>Dates</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Type de dates</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="date_type"
                                        value="fixe"
                                        checked={formData.date_type === 'fixe'}
                                        onChange={handleChange}
                                    />
                                    Fixe
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="date_type"
                                        value="flexible"
                                        checked={formData.date_type === 'flexible'}
                                        onChange={handleChange}
                                    />
                                    Flexible
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date_departure">Date de départ</label>
                            <input
                                type="date"
                                id="date_departure"
                                name="date_departure"
                                value={formData.date_departure}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date_arrival">Date d'arrivée</label>
                            <input
                                type="date"
                                id="date_arrival"
                                name="date_arrival"
                                value={formData.date_arrival}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Prix */}
                <div className="form-section">
                    <h2>Prix</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="price_ht">Prix HT</label>
                            <input
                                type="number"
                                id="price_ht"
                                name="price_ht"
                                value={formData.price_ht}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tva">TVA (%)</label>
                            <input
                                type="number"
                                id="tva"
                                name="tva"
                                value={formData.tva}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price_ttc">Prix TTC</label>
                            <input
                                type="number"
                                id="price_ttc"
                                name="price_ttc"
                                value={formData.price_ttc}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="deposit">Arrhes (30%)</label>
                            <input
                                type="number"
                                id="deposit"
                                name="deposit"
                                value={formData.deposit}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Observations */}
                <div className="form-section">
                    <h2>Observations</h2>
                    <div className="form-group">
                        <textarea
                            id="observations"
                            name="observations"
                            value={formData.observations}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate(`/clients/${id}`)}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Enregistrer les modifications
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientEdit; 