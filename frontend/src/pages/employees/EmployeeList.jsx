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
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des employés</h1>
                <Link to="/employees/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Ajouter un employé
                </Link>
            </div>

            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Rechercher un employé..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                        Rechercher
                    </button>
                </div>
            </form>

            {employees.length === 0 ? (
                <p className="text-center py-4">Aucun employé trouvé.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-left">Nom</th>
                                <th className="py-2 px-4 border-b text-left">Email</th>
                                <th className="py-2 px-4 border-b text-left">Poste</th>
                                <th className="py-2 px-4 border-b text-left">Département</th>
                                <th className="py-2 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => (
                                <tr key={employee._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{employee.firstName} {employee.lastName}</td>
                                    <td className="py-2 px-4 border-b">{employee.email}</td>
                                    <td className="py-2 px-4 border-b">{employee.position}</td>
                                    <td className="py-2 px-4 border-b">{employee.department}</td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            <Link to={`/employees/${employee._id}`} className="text-blue-600 hover:underline">
                                                Voir
                                            </Link>
                                            <Link to={`/employees/edit/${employee._id}`} className="text-green-600 hover:underline">
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(employee._id)}
                                                className="text-red-600 hover:underline"
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
            )}
        </div>
    );
}

export default EmployeeList;