// OrderDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderById, updateOrderStatus, updatePaymentStatus, generateInvoice } from '../../services/orderService';

function OrderDetails() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await getOrderById(id);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors du chargement de la commande:", err);
                setError('Erreur lors du chargement des détails de la commande');
                navigate('/orders');
            }
        };
        fetchOrderDetails();
    }, [id, navigate]);

    const handleStatusChange = async (newStatus) => {
        try {
            await updateOrderStatus(id, newStatus);
            const data = await getOrderById(id);
            setOrder(data);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la mise à jour du statut");
        }
    };

    const handlePaymentStatusChange = async (newStatus) => {
        try {
            await updatePaymentStatus(id, newStatus);
            const data = await getOrderById(id);
            setOrder(data);
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la mise à jour du statut de paiement");
        }
    };

    const handleGenerateInvoice = async () => {
        try {
            await generateInvoice(id);

            // Téléchargement de la facture
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/orders/${id}/invoice/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors du téléchargement');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `facture-${order.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert("Erreur lors de la génération ou téléchargement de la facture");
        }
    };

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

    const translatePaymentMethod = (method) => {
        switch (method) {
            case 'cash': return 'Espèces';
            case 'credit_card': return 'Carte bancaire';
            case 'bank_transfer': return 'Virement bancaire';
            default: return method;
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    if (error) return <div className="text-center py-8">Commande non trouvée</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Détails de la commande</h1>
                <div className="flex space-x-2">
                    <Link to="/orders" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                        Retour
                    </Link>
                    <button
                        onClick={handleGenerateInvoice}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Télécharger la Facture
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">N° Facture</h3>
                        <p className="mt-2 text-gray-800">{order.invoiceNumber}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Date</h3>
                        <p className="mt-2 text-gray-800">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Montant total</h3>
                        <p className="mt-2 text-gray-800">{order.totalAmount.toFixed(2)} FCFA</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                        <p className="mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                                {translateStatus(order.status)}
                            </span>
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Moyen de paiement</h3>
                        <p className="mt-2 text-gray-800">{translatePaymentMethod(order.paymentMethod)}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Statut du paiement</h3>
                        <p className="mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                    order.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.paymentStatus === 'paid' ? 'Payé' :
                                    order.paymentStatus === 'refunded' ? 'Remboursé' : 'En attente'}
                            </span>
                        </p>
                    </div>
                    {order.notes && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                            <p className="mt-2 text-gray-800">{order.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-4">Informations client</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                        <p className="mt-2 text-gray-800">{order.customer.name}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-2 text-gray-800">{order.customer.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                        <p className="mt-2 text-gray-800">{order.customer.address}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                        <p className="mt-2 text-gray-800">{order.customer.phone || 'Non spécifié'}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-4">Articles commandés</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Produit</th>
                                <th className="px-4 py-2 text-right">Prix unitaire</th>
                                <th className="px-4 py-2 text-right">Quantité</th>
                                <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3">{item.product.name}</td>
                                    <td className="px-4 py-3 text-right">{item.price.toFixed(2)} FCFA</td>
                                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                                    <td className="px-4 py-3 text-right">{(item.price * item.quantity).toFixed(2)} FCFA</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td colSpan="3" className="px-4 py-3 font-medium text-right">Total</td>
                                <td className="px-4 py-3 font-bold text-right">{order.totalAmount.toFixed(2)} FCFA</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Mettre à jour le statut</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Statut de la commande</h3>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="mt-2 border rounded px-3 py-2 w-full"
                        >
                            <option value="pending">En attente</option>
                            <option value="processing">En traitement</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                        </select>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Statut du paiement</h3>
                        <select
                            value={order.paymentStatus}
                            onChange={(e) => handlePaymentStatusChange(e.target.value)}
                            className="mt-2 border rounded px-3 py-2 w-full"
                        >
                            <option value="pending">En attente</option>
                            <option value="paid">Payé</option>
                            <option value="refunded">Remboursé</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;