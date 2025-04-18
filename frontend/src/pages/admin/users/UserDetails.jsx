import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirection si l'utilisateur n'est pas admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
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

    if (loading) return <div className="text-center py-10">Chargement...</div>;
    if (error) return <div className="text-center text-red-600 py-10">{error}</div>;
    if (!userData) return <div className="text-center py-10">Utilisateur non trouvé</div>;

    return (
        <div className="px-4 py-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Détails de l'utilisateur</h1>
                <div>
                    <Link to="/admin/users" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2">
                        Retour
                    </Link>
                    <Link to={`/admin/users/edit/${id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
                        Modifier
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        disabled={id === user?.id} // Empêche la suppression de son propre compte
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Informations personnelles</h2>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Nom</p>
                            <p className="text-gray-900">{userData.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">{userData.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Rôle</p>
                            <p className="text-gray-900">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${userData.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {userData.role}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date de création</p>
                            <p className="text-gray-900">
                                {new Date(userData.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetails;