import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/api/auth/login', { email, password });

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                login(res.data.user, res.data.token);
                navigate('/');
            } else {
                setError('Token manquant dans la réponse du serveur');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erreur lors de la connexion';
            setError(errorMessage);
            console.error('Erreur de connexion:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-4xl font-bold text-orange-500">
                        Gestion<span className="text-orange-500">.</span>
                    </h2>
                    <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
                        Connectez-vous à votre compte
                    </h2>
                </div>

                {/* Message d'information avec les identifiants */}
                <div className="bg-orange-50 border-l-4 border-orange-500 text-gray-700 p-4 rounded">
                    <p className="text-sm">Pour tester l'application, utilisez:</p>
                    <p className="font-medium text-sm mt-1">Email: admin@example.com | Mot de passe: admin123</p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    {error}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Adresse email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Mot de passe"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Se connecter
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Pas encore de compte?{' '}
                        <Link to="/register" className="font-medium text-orange-500 hover:text-orange-600">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;