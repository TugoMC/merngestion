// EditEmployee.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function EditEmployee() {
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        hireDate: '',
        salary: ''
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await api.get(`/api/employees/${id}`);
                // Format date for input
                const employee = res.data;
                if (employee.hireDate) {
                    employee.hireDate = employee.hireDate.split('T')[0];
                }
                setEmployee(employee);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors du chargement de l'employé:", err);
                navigate('/employees');
            }
        };
        fetchEmployee();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/employees/${id}`, employee);
            navigate('/employees');
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la mise à jour de l'employé");
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Modifier l'employé</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Prénom</label>
                        <input
                            type="text"
                            name="firstName"
                            value={employee.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Nom</label>
                        <input
                            type="text"
                            name="lastName"
                            value={employee.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={employee.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={employee.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Poste</label>
                        <input
                            type="text"
                            name="position"
                            value={employee.position}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Département</label>
                        <input
                            type="text"
                            name="department"
                            value={employee.department}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Date d'embauche</label>
                        <input
                            type="date"
                            name="hireDate"
                            value={employee.hireDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Salaire</label>
                        <input
                            type="number"
                            name="salary"
                            value={employee.salary}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/employees')}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        Mettre à jour
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditEmployee;