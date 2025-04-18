import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

function UserForm({ userId, isEdit = false }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employe'
    });

    // Si en mode édition, charger les données de l'utilisateur
    useEffect(() => {
        if (isEdit && userId) {
            const fetchUser = async () => {
                try {
                    const response = await api.get(`/api/users/${userId}`);
                    const userData = response.data;

                    setFormData({
                        name: userData.name,
                        email: userData.email,
                        password: '',
                        confirmPassword: '',
                        role: userData.role
                    });
                    setLoading(false);
                } catch (err) {
                    setError('Erreur lors du chargement des données utilisateur');
                    setLoading(false);
                    console.error('Erreur:', err);
                }
            };

            fetchUser();
        }
    }, [isEdit, userId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation des mots de passe
        if (!isEdit && formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            // Création ou mise à jour selon le mode
            if (isEdit) {
                // Données à envoyer (exclure confirmPassword)
                const { confirmPassword, ...updateData } = formData;
                // Si le mot de passe est vide, ne pas l'envoyer
                if (!updateData.password) {
                    delete updateData.password;
                }

                await api.put(`/api/users/${userId}`, updateData);
            } else {
                // Données à envoyer (exclure confirmPassword)
                const { confirmPassword, ...createData } = formData;
                await api.post('/api/users/register', createData);
            }

            // Redirection vers la liste des utilisateurs
            navigate('/admin/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
            console.error('Erreur:', err);
        }
    };

    if (loading) return <div className="text-center py-10">Chargement...</div>;

    return (
        <div className="px-4 py-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nom complet
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Mot de passe {isEdit && '(laisser vide pour ne pas modifier)'}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required={!isEdit}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirmer le mot de passe
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required={!isEdit || formData.password !== ''}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Rôle
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="employe">Employé</option>
                        <option value="admin">Administrateur</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {isEdit ? 'Mettre à jour' : 'Créer'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/users')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserForm;