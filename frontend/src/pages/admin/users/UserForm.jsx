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

        if (isEdit && formData.password && formData.password !== formData.confirmPassword) {
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

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                {isEdit ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
            </h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="name">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="password">
                            Mot de passe {isEdit && '(laisser vide pour ne pas modifier)'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required={!isEdit}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="confirmPassword">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required={!isEdit || formData.password !== ''}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="role">
                            Rôle
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="employe">Employé</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/users')}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        {isEdit ? 'Mettre à jour' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserForm;