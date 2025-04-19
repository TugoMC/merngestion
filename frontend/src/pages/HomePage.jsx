import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Users, Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';

const HomePage = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Couleurs pour les graphiques avec la palette de Tomato
    const COLORS = ['#FF6347', '#FF8C69', '#FFA07A', '#FFD700', '#20B2AA', '#87CEFA'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/public/dashboard');
                setDashboardData(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des données du tableau de bord:', err);
                setError('Impossible de charger les données du tableau de bord');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Préparer les données pour les graphiques
    const prepareSalesChartData = () => {
        if (!dashboardData || !dashboardData.sales || !dashboardData.sales.salesByDay) return [];
        return dashboardData.sales.salesByDay.map(day => ({
            date: day._id,
            montant: day.totalAmount,
            commandes: day.count
        }));
    };

    const prepareProductCategoryData = () => {
        if (!dashboardData || !dashboardData.products || !dashboardData.products.productsByCategory) return [];

        return Object.entries(dashboardData.products.productsByCategory).map(([category, count]) => ({
            name: category,
            value: count
        }));
    };

    const prepareEmployeeDepartmentData = () => {
        if (!dashboardData || !dashboardData.employees || !dashboardData.employees.employeesByDepartment) return [];

        return Object.entries(dashboardData.employees.employeesByDepartment).map(([department, count]) => ({
            name: department,
            value: count
        }));
    };

    if (loading) return <div className="flex justify-center items-center h-64">Chargement des données...</div>;

    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Tableau de bord</h1>

                {/* Message d'information de connexion */}
                <div className="bg-blue-50 border-l-4 border-orange-500 text-gray-700 p-4 mb-8 rounded">
                    <p>Cette page est publique et accessible par tous. Connectez-vous avec ces identifiants pour agir sur le tableau:</p>
                    <p className="font-medium mt-1">Email: admin@example.com | Mot de passe: admin123</p>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Ventes totales"
                        value={dashboardData?.sales?.totalSales?.toLocaleString('fr-FR') + ' FCFA'}
                        icon={<DollarSign className="text-orange-500" size={24} />}
                    />
                    <StatCard
                        title="Commandes"
                        value={dashboardData?.sales?.totalOrders}
                        icon={<ShoppingCart className="text-orange-500" size={24} />}
                    />
                    <StatCard
                        title="Produits"
                        value={dashboardData?.products?.totalProducts}
                        icon={<Package className="text-orange-500" size={24} />}
                    />
                    <StatCard
                        title="Employés"
                        value={dashboardData?.employees?.totalEmployees}
                        icon={<Users className="text-orange-500" size={24} />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Graphique des ventes des 7 derniers jours */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-6">Ventes des 7 derniers jours</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={prepareSalesChartData()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                                <XAxis dataKey="date" tick={{ fill: '#666' }} />
                                <YAxis yAxisId="left" tick={{ fill: '#666' }} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#666' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="montant"
                                    name="Montant (FCFA)"
                                    stroke="#FF6347"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="commandes"
                                    name="Commandes"
                                    stroke="#20B2AA"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Commandes par statut */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-6">Commandes par statut</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={Object.entries(dashboardData?.sales?.ordersByStatus || {}).map(([status, count]) => ({
                                status, count
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                                <XAxis dataKey="status" tick={{ fill: '#666' }} />
                                <YAxis tick={{ fill: '#666' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="count" name="Nombre de commandes" fill="#FF6347" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Graphiques en camembert */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Produits par catégorie */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-6">Produits par catégorie</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={prepareProductCategoryData()}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {prepareProductCategoryData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Employés par département */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-6">Employés par département</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={prepareEmployeeDepartmentData()}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {prepareEmployeeDepartmentData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Utilisateurs par rôle */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-6">Utilisateurs par rôle</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={Object.entries(dashboardData?.users?.usersByRole || {}).map(([role, count]) => ({
                                        name: role,
                                        value: count
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {Object.entries(dashboardData?.users?.usersByRole || {}).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant pour afficher une carte de statistique
const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-600 font-medium">{title}</h3>
                {icon}
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    );
};

export default HomePage;