import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminDashboard() {
    const { user } = useAuth();

    // Redirection si l'utilisateur n'est pas admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-gradient-to-b from-orange-300 to-orange-100 text-white py-16 px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-5xl font-bold mb-4">Administration</h1>
                    <p className="text-xl max-w-2xl">
                        Gérez tous les aspects de votre entreprise depuis cette interface centrale. Accédez aux données et fonctionnalités en quelques clics.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6 text-gray-700 transform transition-transform hover:scale-105">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Gestion des utilisateurs</h2>
                        <p className="text-gray-600 mb-6">Gérer les comptes utilisateurs, les permissions et les rôles dans le système.</p>
                        <Link to="/admin/users" className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 inline-block transition-colors">
                            Gérer les utilisateurs
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 text-gray-700 transform transition-transform hover:scale-105">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Gestion des employés</h2>
                        <p className="text-gray-600 mb-6">Ajoutez, modifiez ou supprimez des informations sur les employés de l'entreprise.</p>
                        <Link to="/employees" className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 inline-block transition-colors">
                            Gérer les employés
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 text-gray-700 transform transition-transform hover:scale-105">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Gestion des stocks</h2>
                        <p className="text-gray-600 mb-6">Gérez l'inventaire, les produits et suivez les niveaux de stock en temps réel.</p>
                        <Link to="/products" className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 inline-block transition-colors">
                            Gérer les produits
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 text-gray-700 transform transition-transform hover:scale-105">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Gestion des commandes</h2>
                        <p className="text-gray-600 mb-6">Suivez, gérez et créez des commandes clients pour votre entreprise.</p>
                        <Link to="/orders" className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 inline-block transition-colors">
                            Gérer les commandes
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 text-gray-700 transform transition-transform hover:scale-105">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Rapports et statistiques</h2>
                        <p className="text-gray-600 mb-6">Analysez les performances de votre entreprise avec des tableaux de bord détaillés.</p>
                        <Link to="/" className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 inline-block transition-colors">
                            Voir les statistiques
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 text-gray-700 transform transition-transform hover:scale-105">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Paramètres système</h2>
                        <p className="text-gray-600 mb-6">Configurez les paramètres globaux et les options de votre application.</p>
                        <Link to="/admin/settings" className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 inline-block transition-colors">
                            Prochainement
                        </Link>
                    </div>
                </div>

                {/* Call to action */}
                <div className="mt-12 text-center">
                    <Link to="/" className="text-white underline text-lg hover:text-orange-500 transition-colors">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;