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

    // Couleurs pour les graphiques
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Pas besoin de vérifier si l'utilisateur est connecté
                // Utiliser un endpoint public pour les données du tableau de bord
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
    }, []); // Retiré la dépendance à l'utilisateur

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
        <div className="px-4 pb-8">
            <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

            {/* Message d'information de connexion */}
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
                <p>Cette page est publique et accessible par tous. Connectez-vous avec ces identifiants pour agir sur le tableau:</p>
                <p className="font-medium mt-1">Email: admin@example.com | Mot de passe: admin123</p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Ventes totales"
                    value={dashboardData?.sales?.totalSales?.toLocaleString('fr-FR') + ' FCFA'}
                    icon={<DollarSign className="text-green-500" />}
                />
                <StatCard
                    title="Commandes"
                    value={dashboardData?.sales?.totalOrders}
                    icon={<ShoppingCart className="text-blue-500" />}
                />
                <StatCard
                    title="Produits"
                    value={dashboardData?.products?.totalProducts}
                    icon={<Package className="text-purple-500" />}
                />
                <StatCard
                    title="Employés"
                    value={dashboardData?.employees?.totalEmployees}
                    icon={<Users className="text-orange-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Graphique des ventes des 7 derniers jours */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Ventes des 7 derniers jours</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={prepareSalesChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="montant"
                                name="Montant (FCFA)"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="commandes"
                                name="Commandes"
                                stroke="#82ca9d"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Commandes par statut */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Commandes par statut</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={Object.entries(dashboardData?.sales?.ordersByStatus || {}).map(([status, count]) => ({
                            status, count
                        }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Nombre de commandes" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Produits par catégorie */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Produits par catégorie</h2>
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
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Employés par département */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Employés par département</h2>
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
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Utilisateurs par rôle */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Utilisateurs par rôle</h2>
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
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Alertes et notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Produits à faible stock */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <AlertTriangle className="mr-2 text-amber-500" size={20} />
                        Produits à faible stock
                    </h2>
                    <div className="flex items-center justify-between mb-2">
                        <span>Nombre de produits à faible stock:</span>
                        <span className="font-semibold text-amber-500">{dashboardData?.products?.lowStockCount || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-amber-500 h-2.5 rounded-full"
                            style={{ width: `${dashboardData?.products?.lowStockPercentage || 0}%` }}
                        ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        {(dashboardData?.products?.lowStockPercentage || 0).toFixed(1)}% du stock total
                    </div>
                </div>

                {/* Nouveaux utilisateurs et employés */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Nouveaux arrivants (30 derniers jours)</h2>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <ArrowUpCircle className="mr-2 text-green-500" size={20} />
                            <div>
                                <p className="font-semibold">{dashboardData?.users?.newUsers || 0} nouveaux utilisateurs</p>
                                <p className="text-sm text-gray-500">enregistrés sur la plateforme</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <ArrowUpCircle className="mr-2 text-blue-500" size={20} />
                            <div>
                                <p className="font-semibold">{dashboardData?.employees?.newEmployees || 0} nouveaux employés</p>
                                <p className="text-sm text-gray-500">ajoutés à l'entreprise</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant pour afficher une carte de statistique
const StatCard = ({ title, value, icon, trend }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-500 font-medium">{title}</h3>
                {icon}
            </div>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
                <div className="flex items-center mt-2">
                    {trend.direction === 'up' ? (
                        <ArrowUpCircle className="text-green-500 mr-1" size={16} />
                    ) : (
                        <ArrowDownCircle className="text-red-500 mr-1" size={16} />
                    )}
                    <span className={trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}>
                        {trend.value}%
                    </span>
                </div>
            )}
        </div>
    );
};

export default HomePage;