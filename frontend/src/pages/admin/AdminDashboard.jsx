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
        <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Tableau de bord d'administration</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
                    <p className="text-gray-600 mb-4">Gérer les comptes utilisateurs et leurs permissions.</p>
                    <Link to="/admin/users" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
                        Gérer les utilisateurs
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Gestion des employés</h2>
                    <p className="text-gray-600 mb-4">Ajouter, modifier ou supprimer des employés de l'entreprise.</p>
                    <Link to="/employees" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block">
                        Gérer les employés
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Gestion des stocks</h2>
                    <p className="text-gray-600 mb-4">Gérer l'inventaire, les produits et suivre les niveaux de stock.</p>
                    <Link to="/products" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 inline-block">
                        Gérer les produits
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Paramètres système</h2>
                    <p className="text-gray-600 mb-4">Configurer les paramètres de l'application.</p>
                    <Link to="/admin/settings" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block">
                        Accéder aux paramètres
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;