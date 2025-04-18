import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
    const { user } = useAuth();

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Gestion d'Entreprise
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Solution complète pour gérer efficacement une petite entreprise
                </p>
            </div>

            <div className="mt-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900">Gestion des employés</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Gérez facilement vos employés, leurs informations et leurs dossiers.
                            </p>
                            <div className="mt-4">

                                Connectez vous en admin pour accéder a la gestion des employes

                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900">Tableau de bord</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Visualisez les informations importantes de votre entreprise en un coup d'œil.
                            </p>
                            <div className="mt-4">
                                {user && user.role === 'admin' ? (
                                    <Link
                                        to="/admin"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Accéder au tableau de bord &rarr;
                                    </Link>
                                ) : (
                                    <span className="text-sm text-gray-400">Accès réservé aux administrateurs</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900">Ressources</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Accédez aux ressources et documents importants pour votre entreprise.
                            </p>
                            <div className="mt-4">
                                <Link
                                    to="#"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Explorer les ressources &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!user && (
                <div className="mt-12 text-center">
                    <p className="text-base text-gray-500">
                        Connectez-vous pour accéder à toutes les fonctionnalités
                    </p>
                    <div className="mt-4 flex justify-center gap-4">
                        <Link
                            to="/login"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Se connecter
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            S'inscrire
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;