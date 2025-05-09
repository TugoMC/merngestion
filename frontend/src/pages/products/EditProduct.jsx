// EditProduct.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function EditProduct() {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: 0,
        lowStockThreshold: 5,
        supplier: '',
        sku: ''
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/api/products/${id}`);
                setProduct(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors du chargement du produit:", err);
                navigate('/products');
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'quantity' || name === 'lowStockThreshold'
                ? value === '' ? '' : Number(value)
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/products/${id}`, product);
            navigate('/products');
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la mise à jour du produit");
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Modifier le produit</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Nom du produit</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Catégorie</label>
                        <input
                            type="text"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Prix</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Quantité</label>
                        <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Seuil de stock bas</label>
                        <input
                            type="number"
                            name="lowStockThreshold"
                            value={product.lowStockThreshold}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Fournisseur</label>
                        <input
                            type="text"
                            name="supplier"
                            value={product.supplier}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Référence (SKU)</label>
                        <input
                            type="text"
                            name="sku"
                            value={product.sku}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">La référence ne peut pas être modifiée</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-600">Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
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

export default EditProduct;