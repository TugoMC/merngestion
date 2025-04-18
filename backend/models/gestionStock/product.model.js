import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 5
    },
    supplier: {
        type: String,
        trim: true
    },
    sku: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Méthode virtuelle pour vérifier si le stock est faible
productSchema.virtual('isLowStock').get(function () {
    return this.quantity <= this.lowStockThreshold;
});

// S'assurer que les virtuals sont inclus lors de la conversion en JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;