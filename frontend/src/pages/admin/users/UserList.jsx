import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user || user.role !== 'admin') {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-orange-50 border-l-4 border-orange-500 text-gray-700 p-4 rounded">
                    <p className="font-bold">Accès refusé</p>
                    <p>Vous devez être administrateur pour accéder à cette page.</p>
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    // Récupération des utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors de la récupération des utilisateurs');
                setLoading(false);
                console.error('Erreur:', err);
            }
        };

        fetchUsers();
    }, []);

    // Suppression d'un utilisateur
    const handleDelete = async (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await api.delete(`/api/users/${userId}`);
                // Mise à jour de la liste
                setUsers(users.filter(u => u._id !== userId));
            } catch (err) {
                setError('Erreur lors de la suppression');
                console.error('Erreur:', err);
            }
        }
    };

    // Recherche d'utilisateurs
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            if (searchQuery.trim()) {
                const response = await api.get(`/api/users/search?query=${searchQuery}`);
                setUsers(response.data);
            } else {
                const response = await api.get('/api/users');
                setUsers(response.data);
            }
        } catch (err) {
            setError('Erreur lors de la recherche');
            console.error('Erreur:', err);
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    if (error) return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">{error}</div>
            <div className="mt-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );

    return (
        <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
                    <Link to="/admin/users/create" className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors">
                        Ajouter un utilisateur
                    </Link>
                </div>

                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
                            Rechercher
                        </button>
                    </form>
                </div>

                {users.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-gray-600">Aucun utilisateur trouvé.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Nom</th>
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Email</th>
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Rôle</th>
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b hover:bg-gray-50">
                                            <td className="py-4 px-6">{u.name}</td>
                                            <td className="py-4 px-6">{u.email}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex space-x-3">
                                                    <Link to={`/admin/users/${u._id}`} className="text-orange-500 hover:text-orange-700">
                                                        Voir
                                                    </Link>
                                                    <Link to={`/admin/users/edit/${u._id}`} className="text-green-600 hover:text-green-800">
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(u._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        disabled={u._id === user?._id}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserList;