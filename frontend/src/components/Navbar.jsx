import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { checkApiStatus } from '../services/api';

function Navbar() {
    const { user, logout } = useAuth();
    const [apiStatus, setApiStatus] = useState('checking');

    // Safer API status check with error handling
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
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-orange-500 font-bold text-2xl">
                            Gestion<span className="text-orange-400">.</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                            home
                        </Link>
                        {user && (
                            <>

                                <Link to="/admin/users" className="text-gray-600 hover:text-gray-900">
                                    users
                                </Link>

                                <Link to="/employees" className="text-gray-600 hover:text-gray-900">
                                    employees
                                </Link>
                                <Link to="/products" className="text-gray-600 hover:text-gray-900">
                                    products
                                </Link>
                                <Link to="/orders" className="text-gray-600 hover:text-gray-900">
                                    orders
                                </Link>
                            </>
                        )}
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                                admin
                            </Link>
                        )}

                    </div>

                    {/* Right Side - Auth & API Status */}
                    <div className="flex items-center space-x-4">
                        {/* API Status Indicator */}
                        <div className="px-3 py-1 bg-gray-100 rounded-md">
                            {renderApiStatus()}
                        </div>

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {/* User Profile Text */}
                                <span className="text-gray-600 text-sm hidden md:block">
                                    {user.name || user.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                    Connexion
                                </Link>
                                <Link to="/register" className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 text-sm transition-colors">
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;