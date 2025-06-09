import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/clients/ClientList';
import ClientForm from './pages/clients/ClientForm';
import ClientDetails from './pages/clients/ClientDetails';
import QuoteList from './pages/quotes/QuoteList';
import QuoteForm from './pages/quotes/QuoteForm';
import QuoteDetails from './pages/quotes/QuoteDetails';
import './styles/App.css';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useStore();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    
                    {/* Routes pour les clients */}
                    <Route path="clients" element={<ClientList />} />
                    <Route path="clients/new" element={<ClientForm />} />
                    <Route path="clients/:id" element={<ClientDetails />} />
                    <Route path="clients/:id/edit" element={<ClientForm />} />
                    
                    {/* Routes pour les devis */}
                    <Route path="quotes" element={<QuoteList />} />
                    <Route path="quotes/new" element={<QuoteForm />} />
                    <Route path="quotes/:id" element={<QuoteDetails />} />
                    <Route path="quotes/:id/edit" element={<QuoteForm />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
