import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

function ProductDetails() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/api/products/${id}`);
                setProduct(res.data);
                setQuantity(res.data.quantity);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors du chargement du produit:", err);
                navigate('/products');
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
            try {
                await api.delete(`/api/products/${id}`);
                navigate('/products');
            } catch (err) {
                alert(err.response?.data?.message || "Erreur lors de la suppression");
            }
        }
    };

    const handleQuantityChange = async () => {
        try {
            const res = await api.patch(`/api/products/${id}/quantity`, { quantity });
            setProduct(res.data.product);

            if (res.data.alert) {
                alert(res.data.alert);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la mise à jour de la quantité");
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    if (!product) return <div className="text-center py-8">Produit non trouvé</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Détails du produit</h1>
                <div className="flex space-x-2">
                    <Link to="/products" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                        Retour
                    </Link>
                    <Link to={`/products/edit/${id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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
                        <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                        <p className="mt-1">{product.name}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
                        <p className="mt-1">{product.category}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Prix</h3>
                        <p className="mt-1">{product.price} FCFA</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Référence (SKU)</h3>
                        <p className="mt-1">{product.sku}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Fournisseur</h3>
                        <p className="mt-1">{product.supplier || 'Non renseigné'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Seuil de stock bas</h3>
                        <p className="mt-1">{product.lowStockThreshold}</p>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="mt-1">{product.description || 'Aucune description'}</p>
                    </div>
                </div>

                <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-medium">Gestion du stock</h3>
                    <div className="mt-4 flex items-end space-x-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Quantité actuelle</label>
                            <div className={`mt-1 text-xl font-semibold ${product.isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                {product.quantity}
                                {product.isLowStock && <span className="ml-2 text-sm font-normal text-red-600">(Stock bas)</span>}
                            </div>
                        </div>
                        <div className="flex-1 max-w-xs">
                            <label className="block text-sm font-medium text-gray-500">Nouvelle quantité</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                min="0"
                            />
                        </div>
                        <button
                            onClick={handleQuantityChange}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Mettre à jour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;