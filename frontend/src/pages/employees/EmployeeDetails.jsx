import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

function EmployeeDetails() {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await api.get(`/api/employees/${id}`);
                setEmployee(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors du chargement de l'employé:", err);
                navigate('/employees');
            }
        };
        fetchEmployee();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé?")) {
            try {
                await api.delete(`/api/employees/${id}`);
                navigate('/employees');
            } catch (err) {
                alert(err.response?.data?.message || "Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    if (!employee) return <div className="text-center py-8">Employé non trouvé</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Détails de l'employé</h1>
                <div className="flex space-x-2">
                    <Link to="/employees" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                        Retour
                    </Link>
                    <Link to={`/employees/edit/${id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Modifier
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Prénom</h3>
                        <p className="mt-1">{employee.firstName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                        <p className="mt-1">{employee.lastName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1">{employee.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                        <p className="mt-1">{employee.phone || 'Non renseigné'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Poste</h3>
                        <p className="mt-1">{employee.position}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Département</h3>
                        <p className="mt-1">{employee.department}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Date d'embauche</h3>
                        <p className="mt-1">
                            {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'Non renseignée'}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Salaire</h3>
                        <p className="mt-1">
                            {employee.salary ? `${employee.salary} FCFA` : 'Non renseigné'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDetails;