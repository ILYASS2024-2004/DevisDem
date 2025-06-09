import React from 'react';
import { NavLink } from 'react-router-dom';
import useStore from '../../store/useStore';
import '../../styles/Sidebar.css';

const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/clients', label: 'Clients', icon: '👥' },
    { path: '/emails', label: 'Email', icon: '📧' },
    { path: '/loading', label: 'Loading...', icon: '📦' },
    { path: '/sms', label: 'SMS', icon: '💬' },
    { path: '/payments', label: 'Liens de Paiement', icon: '💳' },
    { path: '/tasks', label: 'Gestion des tâches', icon: '✓' },
    { path: '/calculator', label: 'Calculateur de volume', icon: '🧮' }
];

const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useStore();

    return (
        <aside className="sidebar">
            {/* Bouton de toggle */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? '◀' : '▶'}
            </button>

            {/* Menu items */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        {isSidebarOpen && (
                            <span className="sidebar-label">{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar; 