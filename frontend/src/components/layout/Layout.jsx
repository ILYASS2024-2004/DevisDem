import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import './Layout.css';

const Layout = () => {
  const { logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>DevisDem</h1>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Tableau de bord</Link>
          </li>
          <li>
            <Link to="/clients">Clients</Link>
          </li>
          <li>
            <Link to="/quotes">Devis</Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 