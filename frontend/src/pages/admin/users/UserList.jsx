import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

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
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                setError('Erreur lors de la suppression');
                console.error('Erreur:', err);
            }
        }
    };

    if (loading) return <div className="text-center py-10">Chargement...</div>;
    if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

    return (
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
                <Link to="/admin/users/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Ajouter un utilisateur
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/admin/users/${user._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            Détails
                                        </Link>
                                        <Link to={`/admin/users/edit/${user._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:text-red-900"
                                            disabled={user._id === user?.id} // Empêche la suppression de son propre compte
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center">Aucun utilisateur trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserList;