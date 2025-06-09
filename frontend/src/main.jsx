import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { useStore } from './store';

// Vérification de l'authentification au chargement
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

if (token && user) {
    const { setAuth } = useStore.getState();
    setAuth(JSON.parse(user), token);
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
