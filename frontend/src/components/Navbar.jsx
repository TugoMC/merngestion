import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { checkApiStatus } from '../services/api';

function Navbar() {
    const { user, logout } = useAuth();
    const [apiStatus, setApiStatus] = useState('checking');

    // Vérifier l'état de la connexion au backend
    useEffect(() => {
        const verifyApiStatus = async () => {
            try {
                const isConnected = await checkApiStatus();
                setApiStatus(isConnected ? 'connected' : 'error');
            } catch (error) {
                console.error('Error checking API status:', error);
                setApiStatus('error');
            }
        };

        verifyApiStatus();
        const interval = setInterval(verifyApiStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    // Rendu de l'indicateur selon l'état de la connexion
    const renderApiStatus = () => {
        if (apiStatus === 'checking') {
            return <span className="text-yellow-500 text-xs">Vérification API...</span>;
        } else if (apiStatus === 'connected') {
            return <span className="text-green-500 text-xs font-medium">API Connected</span>;
        } else {
            return <span className="text-red-500 text-xs font-medium">API is not working</span>;
        }
    };

    return (
        <nav className="bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-white font-bold text-xl">Mon App</Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Accueil
                                </Link>
                                {user && user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        Administration
                                    </Link>
                                )}
                                <div className="px-3 py-2">
                                    {renderApiStatus()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300 text-sm">{user.name || user.email}</span>
                                    <button
                                        onClick={logout}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        Connexion
                                    </Link>
                                    <Link to="/register" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                                        Inscription
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;