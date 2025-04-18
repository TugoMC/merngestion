// src/pages/orders/OrderList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus, generateInvoice, getInvoiceDownloadUrl } from '../../services/orderService';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des commandes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders(); // Rafraîchir la liste après mise à jour
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut:', err);
            alert('Erreur lors de la mise à jour du statut');
        }
    };



    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(order => order.status === statusFilter);

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Fonction pour obtenir la classe de couleur selon le statut
    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Traduire les statuts en français
    const translateStatus = (status) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'processing': return 'En traitement';
            case 'shipped': return 'Expédiée';
            case 'delivered': return 'Livrée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    if (loading) return <div className="text-center py-10">Chargement des commandes...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Suivi des commandes</h1>
                <Link
                    to="/orders/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Nouvelle commande
                </Link>
            </div>

            {/* Filtres */}
            <div className="mb-6">
                <label className="font-medium mr-2">Filtrer par statut:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-3 py-1"
                >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="processing">En traitement</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                </select>
            </div>

            {filteredOrders.length === 0 ? (
                <p className="text-center py-10">Aucune commande trouvée</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">N° Facture</th>
                                <th className="px-4 py-3 text-left">Client</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Montant</th>
                                <th className="px-4 py-3 text-left">Statut</th>
                                <th className="px-4 py-3 text-left">Paiement</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{order.invoiceNumber}</td>
                                    <td className="px-4 py-3">{order.customer.name}</td>
                                    <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                                    <td className="px-4 py-3">{order.totalAmount.toFixed(2)} FCFA</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                                            {translateStatus(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                            order.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.paymentStatus === 'paid' ? 'Payé' :
                                                order.paymentStatus === 'refunded' ? 'Remboursé' : 'En attente'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex justify-center space-x-2">
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Détails
                                        </Link>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="border text-sm rounded px-2 py-1"
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="processing">En traitement</option>
                                            <option value="shipped">Expédiée</option>
                                            <option value="delivered">Livrée</option>
                                            <option value="cancelled">Annulée</option>
                                        </select>

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

export default OrderList;