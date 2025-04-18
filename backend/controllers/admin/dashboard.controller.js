import Order from '../../models/gestionVentes/order.model.js';
import Product from '../../models/gestionStock/product.model.js';
import Employee from '../../models/gestionEmploye/employee.model.js';
import User from '../../models/gestionUser/user.model.js';

// Obtenir les statistiques publiques pour le tableau de bord d'accueil
export const getPublicDashboardStats = async (req, res) => {
    try {
        // Obtenir toutes les statistiques publiques
        const [
            salesStats,
            productStats,
            employeeStats,
            userStats
        ] = await Promise.all([
            getPublicSalesStatistics(),
            getPublicProductStatistics(),
            getPublicEmployeeStatistics(),
            getPublicUserStatistics()
        ]);

        res.status(200).json({
            sales: salesStats,
            products: productStats,
            employees: employeeStats,
            users: userStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
    }
};

// Statistiques publiques des ventes
async function getPublicSalesStatistics() {
    // Obtenir le nombre total de commandes
    const totalOrders = await Order.countDocuments();

    // Obtenir le montant total des ventes
    const salesAggregate = await Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
    ]);
    const totalSales = salesAggregate.length > 0 ? salesAggregate[0].totalSales : 0;

    // Commandes par statut
    const ordersByStatus = await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Ventes des 7 derniers jours par jour
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const salesByDay = await Order.aggregate([
        { $match: { createdAt: { $gte: last7Days } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalAmount: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return {
        totalOrders,
        totalSales,
        ordersByStatus: ordersByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {}),
        salesByDay
    };
}

// Statistiques publiques des produits
async function getPublicProductStatistics() {
    // Nombre total de produits
    const totalProducts = await Product.countDocuments();

    // Produits à faible stock
    const lowStockCount = await Product.countDocuments({
        $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
    });

    // Produits par catégorie
    const productsByCategory = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    return {
        totalProducts,
        lowStockCount,
        lowStockPercentage: (lowStockCount / totalProducts) * 100,
        productsByCategory: productsByCategory.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {})
    };
}

// Statistiques publiques des employés
async function getPublicEmployeeStatistics() {
    // Nombre total d'employés
    const totalEmployees = await Employee.countDocuments();

    // Employés par département
    const employeesByDepartment = await Employee.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    // Nouveaux employés (30 derniers jours)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const newEmployees = await Employee.countDocuments({ createdAt: { $gte: last30Days } });

    return {
        totalEmployees,
        newEmployees,
        employeesByDepartment: employeesByDepartment.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {})
    };
}

// Statistiques publiques des utilisateurs
async function getPublicUserStatistics() {
    // Nombre total d'utilisateurs
    const totalUsers = await User.countDocuments();

    // Utilisateurs par rôle
    const usersByRole = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    // Nouveaux utilisateurs (30 derniers jours)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const newUsers = await User.countDocuments({ createdAt: { $gte: last30Days } });

    return {
        totalUsers,
        usersByRole: usersByRole.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {}),
        newUsers
    };
}