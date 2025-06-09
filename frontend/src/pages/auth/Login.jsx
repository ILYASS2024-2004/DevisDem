import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import useStore from '../../store/useStore';
import '../../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useStore();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authService.login(formData);
            setAuth(response.data.user, response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.forgotPassword({ email: forgotPasswordEmail });
            setShowForgotPassword(false);
            setForgotPasswordEmail('');
            // Afficher un message de succès
            alert('Un code de vérification a été envoyé à votre email');
        } catch (error) {
            setError(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>DevisDem</h1>
                <h2>Connexion</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="button"
                        className="forgot-password"
                        onClick={() => setShowForgotPassword(true)}
                    >
                        J'ai oublié mon mot de passe
                    </button>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>

            {/* Modal de mot de passe oublié */}
            {showForgotPassword && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Mot de passe oublié</h3>
                        <form onSubmit={handleForgotPassword}>
                            <div className="form-group">
                                <label htmlFor="forgot-email">Email</label>
                                <input
                                    type="email"
                                    id="forgot-email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Envoi...' : 'Envoyer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login; 