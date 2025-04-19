// src/pages/orders/CreateOrder.jsx 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderService';
import { getAllProducts } from '../../services/productService';

function CreateOrder() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // État pour les données du formulaire
    const [formData, setFormData] = useState({
        customer: {
            name: '',
            email: '',
            address: '',
            phone: ''
        },
        items: [],
        paymentMethod: 'cash',
        notes: ''
    });

    // État pour le produit en cours d'ajout
    const [currentItem, setCurrentItem] = useState({
        product: '',
        quantity: 1
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            setError('Erreur lors du chargement des produits');
            console.error(err);
        }
    };

    // Gérer les changements dans les champs du client
    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            customer: {
                ...formData.customer,
                [name]: value
            }
        });
    };

    // Gérer les changements dans le produit actuel
    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,
            [name]: name === 'quantity' ? parseInt(value) : value
        });
    };

    // Ajouter un produit à la commande
    const addItemToOrder = () => {
        if (!currentItem.product || currentItem.quantity < 1) {
            alert('Veuillez sélectionner un produit et une quantité valide');
            return;
        }

        // Vérifier si le produit existe déjà dans la commande
        const existingItemIndex = formData.items.findIndex(
            item => item.product === currentItem.product
        );

        if (existingItemIndex !== -1) {
            // Mettre à jour la quantité si le produit existe déjà
            const updatedItems = [...formData.items];
            updatedItems[existingItemIndex].quantity += currentItem.quantity;

            setFormData({
                ...formData,
                items: updatedItems
            });
        } else {
            // Ajouter un nouveau produit
            setFormData({
                ...formData,
                items: [...formData.items, { ...currentItem }]
            });
        }

        // Réinitialiser le produit actuel
        setCurrentItem({
            product: '',
            quantity: 1
        });
    };

    // Supprimer un produit de la commande
    const removeItem = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            items: updatedItems
        });
    };

    // Calculer le total de la commande
    const calculateTotal = () => {
        return formData.items.reduce((total, item) => {
            const product = products.find(p => p._id === item.product);
            return total + (product ? product.price * item.quantity : 0);
        }, 0).toFixed(2);
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.items.length === 0) {
            alert('Veuillez ajouter au moins un produit à la commande');
            return;
        }

        if (!formData.customer.name || !formData.customer.email || !formData.customer.address) {
            alert('Veuillez remplir tous les champs obligatoires du client');
            return;
        }

        try {
            setLoading(true);
            const result = await createOrder(formData);
            setSuccess(true);

            // Rediriger vers les détails de la commande après 2 secondes
            setTimeout(() => {
                navigate(`/orders/${result.order._id}`);
            }, 2000);
        } catch (err) {
            setError('Erreur lors de la création de la commande');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Créer une nouvelle commande</h1>

            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                    <p>Commande créée avec succès! Vous allez être redirigé...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations client */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Informations client</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="customerName">
                                Nom <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                name="name"
                                value={formData.customer.name}
                                onChange={handleCustomerChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="customerEmail">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="customerEmail"
                                name="email"
                                value={formData.customer.email}
                                onChange={handleCustomerChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="customerAddress">
                                Adresse <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="customerAddress"
                                name="address"
                                value={formData.customer.address}
                                onChange={handleCustomerChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="customerPhone">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                id="customerPhone"
                                name="phone"
                                value={formData.customer.phone}
                                onChange={handleCustomerChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Ajouter des produits */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Ajouter des produits</h2>
                    <div className="flex flex-wrap gap-4 items-end mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="productSelect">
                                Produit
                            </label>
                            <select
                                id="productSelect"
                                name="product"
                                value={currentItem.product}
                                onChange={handleItemChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Sélectionner un produit</option>
                                {products.map(product => (
                                    <option key={product._id} value={product._id}>
                                        {product.name} - {product.price.toFixed(2)}FCFA (Stock: {product.quantity})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-24">
                            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="quantity">
                                Quantité
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                value={currentItem.quantity}
                                onChange={handleItemChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addItemToOrder}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                            disabled={!currentItem.product}
                        >
                            Ajouter
                        </button>
                    </div>

                    {/* Liste des produits ajoutés */}
                    {formData.items.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-gray-600 font-medium">Produit</th>
                                        <th className="px-4 py-2 text-right text-gray-600 font-medium">Prix unitaire</th>
                                        <th className="px-4 py-2 text-right text-gray-600 font-medium">Quantité</th>
                                        <th className="px-4 py-2 text-right text-gray-600 font-medium">Total</th>
                                        <th className="px-4 py-2 text-center text-gray-600 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {formData.items.map((item, index) => {
                                        const product = products.find(p => p._id === item.product);
                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">{product ? product.name : 'Produit inconnu'}</td>
                                                <td className="px-4 py-3 text-right">{product ? product.price.toFixed(2) : '0.00'} FCFA</td>
                                                <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">
                                                    {product ? (product.price * item.quantity).toFixed(2) : '0.00'} FCFA
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 font-medium text-right">Total</td>
                                        <td className="px-4 py-3 font-bold text-right">{calculateTotal()} FCFA</td>
                                        <td className="px-4 py-3"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Aucun produit ajouté</p>
                    )}
                </div>

                {/* Options de paiement et notes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Options de paiement</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="paymentMethod">
                                Mode de paiement
                            </label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="cash">Espèces</option>
                                <option value="credit_card">Carte bancaire</option>
                                <option value="bank_transfer">Virement bancaire</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600" htmlFor="notes">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows="3"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Boutons de soumission */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/orders')}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Création en cours...' : 'Créer la commande'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateOrder;