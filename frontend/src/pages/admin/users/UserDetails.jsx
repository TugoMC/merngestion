import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/api/users/${id}`);
                setUserData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors de la récupération des données utilisateur');
                setLoading(false);
                console.error('Erreur:', err);
            }
        };

        fetchUser();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await api.delete(`/api/users/${id}`);
                navigate('/admin/users');
            } catch (err) {
                setError('Erreur lors de la suppression');
                console.error('Erreur:', err);
            }
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;
    if (error) return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">{error}</div>
            <div className="mt-4">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    Retour à la liste
                </button>
            </div>
        </div>
    );
    if (!userData) return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">Utilisateur non trouvé</div>
            <div className="mt-4">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    Retour à la liste
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Détails de l'utilisateur</h1>
                <div className="flex space-x-2">
                    <Link to="/admin/users" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                        Retour
                    </Link>
                    <Link to={`/admin/users/edit/${id}`} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                        Modifier
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        disabled={id === user?.id}
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                        <p className="mt-2 text-gray-800">{userData.name}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-2 text-gray-800">{userData.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
                        <p className="mt-2">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${userData.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                }`}>
                                {userData.role}
                            </span>
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                        <p className="mt-2 text-gray-800">
                            {new Date(userData.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetails;