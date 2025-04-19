// EmployeeList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/api/employees');
            setEmployees(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors du chargement des employés:", err);
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            if (searchQuery.trim()) {
                const res = await api.get(`/api/employees/search?query=${searchQuery}`);
                setEmployees(res.data);
            } else {
                fetchEmployees();
            }
        } catch (err) {
            console.error("Erreur lors de la recherche:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé?")) {
            try {
                await api.delete(`/api/employees/${id}`);
                setEmployees(employees.filter(emp => emp._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || "Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    return (
        <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Liste des employés</h1>
                    <Link to="/employees/create" className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors">
                        Ajouter un employé
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher un employé..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
                            Rechercher
                        </button>
                    </div>
                </form>

                {employees.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-gray-600">Aucun employé trouvé.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Nom</th>
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Email</th>
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Poste</th>
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Département</th>
                                        <th className="py-3 px-6 text-left text-gray-600 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(employee => (
                                        <tr key={employee._id} className="border-b hover:bg-gray-50">
                                            <td className="py-4 px-6">{employee.firstName} {employee.lastName}</td>
                                            <td className="py-4 px-6">{employee.email}</td>
                                            <td className="py-4 px-6">{employee.position}</td>
                                            <td className="py-4 px-6">{employee.department}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex space-x-3">
                                                    <Link to={`/employees/${employee._id}`} className="text-orange-500 hover:text-orange-700">
                                                        Voir
                                                    </Link>
                                                    <Link to={`/employees/edit/${employee._id}`} className="text-green-600 hover:text-green-800">
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(employee._id)}
                                                        className="text-red-600 hover:text-red-800"
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

export default EmployeeList;