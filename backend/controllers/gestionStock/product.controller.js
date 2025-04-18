import Product from '../../models/gestionStock/product.model.js';

// Récupérer tous les produits
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
    }
};

// Récupérer un produit par son ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du produit', error: error.message });
    }
};

// Créer un nouveau produit
export const createProduct = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé: seul un administrateur peut créer un produit' });
        }

        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: 'Produit créé avec succès', product });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du produit', error: error.message });
    }
};

// Mettre à jour un produit
export const updateProduct = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé: seul un administrateur peut modifier un produit' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.status(200).json({ message: 'Produit mis à jour avec succès', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', error: error.message });
    }
};

// Supprimer un produit
export const deleteProduct = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé: seul un administrateur peut supprimer un produit' });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: error.message });
    }
};

// Rechercher des produits
export const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Paramètre de recherche manquant' });
        }

        const searchRegex = new RegExp(query, 'i');

        const products = await Product.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { supplier: searchRegex },
                { sku: searchRegex }
            ]
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche de produits', error: error.message });
    }
};

// Mettre à jour la quantité d'un produit
export const updateProductQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({ message: 'La quantité est requise' });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        product.quantity = quantity;
        await product.save();

        // Vérifier si le stock est faible et renvoyer une alerte si nécessaire
        const isLowStock = product.quantity <= product.lowStockThreshold;

        res.status(200).json({
            message: 'Quantité mise à jour avec succès',
            product,
            alert: isLowStock ? `Stock faible pour ${product.name} (${product.quantity} restants)` : null
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité', error: error.message });
    }
};

// Obtenir tous les produits avec un stock faible
export const getLowStockProducts = async (req, res) => {
    try {
        // Récupérer les produits où la quantité est inférieure ou égale au seuil de stock bas
        const lowStockProducts = await Product.find({
            $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
        });

        res.status(200).json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits à stock faible', error: error.message });
    }
};