import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [showLowStock, setShowLowStock] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchLowStockProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/api/products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors du chargement des produits:", err);
            setLoading(false);
        }
    };

    const fetchLowStockProducts = async () => {
        try {
            const res = await api.get('/api/products/low-stock');
            setLowStockProducts(res.data);
        } catch (err) {
            console.error("Erreur lors du chargement des produits à stock faible:", err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            if (searchQuery.trim()) {
                const res = await api.get(`/api/products/search?query=${searchQuery}`);
                setProducts(res.data);
                setShowLowStock(false);
            } else {
                fetchProducts();
                setShowLowStock(false);
            }
        } catch (err) {
            console.error("Erreur lors de la recherche:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
            try {
                await api.delete(`/api/products/${id}`);
                setProducts(products.filter(prod => prod._id !== id));
                // Mettre à jour également la liste des produits à stock faible
                setLowStockProducts(lowStockProducts.filter(prod => prod._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || "Erreur lors de la suppression");
            }
        }
    };

    const toggleLowStockView = () => {
        setShowLowStock(!showLowStock);
    };

    const displayedProducts = showLowStock ? lowStockProducts : products;

    if (loading) return <div className="text-center py-8">Chargement...</div>;

    return (
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des stocks</h1>
                <Link to="/products/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Ajouter un produit
                </Link>
            </div>

            <div className="flex justify-between mb-6">
                <form onSubmit={handleSearch} className="flex-1 mr-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                            Rechercher
                        </button>
                    </div>
                </form>
                <button
                    onClick={toggleLowStockView}
                    className={`${showLowStock ? 'bg-yellow-500' : 'bg-gray-200'} px-4 py-2 rounded hover:${showLowStock ? 'bg-yellow-600' : 'bg-gray-300'}`}
                >
                    {showLowStock ? 'Afficher tous les produits' : `Stock faible (${lowStockProducts.length})`}
                </button>
            </div>

            {displayedProducts.length === 0 ? (
                <p className="text-center py-4">Aucun produit trouvé.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-left">Nom</th>
                                <th className="py-2 px-4 border-b text-left">Catégorie</th>
                                <th className="py-2 px-4 border-b text-left">Prix</th>
                                <th className="py-2 px-4 border-b text-left">Quantité</th>
                                <th className="py-2 px-4 border-b text-left">Référence</th>
                                <th className="py-2 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedProducts.map(product => (
                                <tr key={product._id} className={`hover:bg-gray-50 ${product.isLowStock ? 'bg-yellow-50' : ''}`}>
                                    <td className="py-2 px-4 border-b">{product.name}</td>
                                    <td className="py-2 px-4 border-b">{product.category}</td>
                                    <td className="py-2 px-4 border-b">{product.price} FCFA</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={product.isLowStock ? 'text-red-600 font-medium' : ''}>
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">{product.sku}</td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            <Link to={`/products/${product._id}`} className="text-blue-600 hover:underline">
                                                Voir
                                            </Link>
                                            <Link to={`/products/edit/${product._id}`} className="text-green-600 hover:underline">
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
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

export default ProductList;