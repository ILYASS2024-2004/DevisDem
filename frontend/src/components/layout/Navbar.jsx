import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import '../../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { 
        isDarkMode, 
        toggleDarkMode, 
        toggleMobileMenu, 
        user,
        clearAuth 
    } = useStore();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            {/* Menu hamburger pour mobile */}
            <button className="menu-button" onClick={toggleMobileMenu}>
                <span className="hamburger"></span>
            </button>

            {/* Logo */}
            <div className="logo" onClick={() => navigate('/dashboard')}>
                DevisDem
            </div>

            {/* Actions */}
            <div className="navbar-actions">
                {/* Switch dark/light mode */}
                <button 
                    className="theme-toggle"
                    onClick={toggleDarkMode}
                    title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>

                {/* Profil utilisateur */}
                {user && (
                    <div className="user-menu">
                        <button className="user-button">
                            <span className="user-avatar">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                            <span className="user-name">
                                {user.first_name} {user.last_name}
                            </span>
                        </button>
                        <div className="user-dropdown">
                            <button onClick={() => navigate('/profile')}>
                                Profil
                            </button>
                            <button onClick={handleLogout}>
                                Déconnexion
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 