// src/pages/orders/OrderDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus, updatePaymentStatus, generateInvoice, getInvoiceDownloadUrl } from '../../services/orderService';

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await getOrderById(id);
            setOrder(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des détails de la commande');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateOrderStatus(id, newStatus);
            fetchOrderDetails(); // Rafraîchir les détails
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut:', err);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const handlePaymentStatusChange = async (newStatus) => {
        try {
            await updatePaymentStatus(id, newStatus);
            fetchOrderDetails(); // Rafraîchir les détails
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut de paiement:', err);
            alert('Erreur lors de la mise à jour du statut de paiement');
        }
    };

    const handleGenerateInvoice = async () => {
        try {
            await generateInvoice(id);

            // Au lieu d'ouvrir dans un nouvel onglet, télécharger directement
            const token = localStorage.getItem('authToken'); // Ou d'où vous stockez votre token
            const response = await fetch(`/api/orders/${id}/invoice/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors du téléchargement');
            }

            // Créer un blob et le télécharger
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
            console.error('Erreur lors de la génération ou téléchargement de la facture:', err);
            alert('Erreur lors de la génération ou téléchargement de la facture');
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

    if (loading) return <div className="text-center py-10">Chargement des détails...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
    if (!order) return <div className="text-center py-10">Commande non trouvée</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Détails de la commande</h1>
                <div className="space-x-2">
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Retour
                    </button>
                    <button
                        onClick={handleGenerateInvoice}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Télécharger la Facture
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Informations de commande</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">N° Facture:</span> {order.invoiceNumber}</p>
                            <p><span className="font-medium">Date:</span> {formatDate(order.createdAt)}</p>
                            <p><span className="font-medium">Montant total:</span> {order.totalAmount.toFixed(2)} FCFA</p>
                            <p>
                                <span className="font-medium">Statut:</span>
                                <span className={`ml-2 px-3 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                                    {translateStatus(order.status)}
                                </span>
                            </p>
                            <p>
                                <span className="font-medium">Moyen de paiement:</span> {translatePaymentMethod(order.paymentMethod)}
                            </p>
                            <p>
                                <span className="font-medium">Statut du paiement:</span>
                                <span className={`ml-2 px-3 py-1 rounded-full text-xs ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                    order.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.paymentStatus === 'paid' ? 'Payé' :
                                        order.paymentStatus === 'refunded' ? 'Remboursé' : 'En attente'}
                                </span>
                            </p>
                            {order.notes && <p><span className="font-medium">Notes:</span> {order.notes}</p>}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Informations client</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Nom:</span> {order.customer.name}</p>
                            <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                            <p><span className="font-medium">Adresse:</span> {order.customer.address}</p>
                            <p><span className="font-medium">Téléphone:</span> {order.customer.phone || 'Non spécifié'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Mettre à jour le statut</h2>
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Statut de la commande</label>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        >
                            <option value="pending">En attente</option>
                            <option value="processing">En traitement</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Statut du paiement</label>
                        <select
                            value={order.paymentStatus}
                            onChange={(e) => handlePaymentStatusChange(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
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