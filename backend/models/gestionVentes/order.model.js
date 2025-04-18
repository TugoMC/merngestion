import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    customer: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        }
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'bank_transfer'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    invoiceNumber: {
        type: String,
        unique: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Générer un numéro de facture automatiquement avant de sauvegarder
orderSchema.pre('save', async function (next) {
    if (!this.invoiceNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');

        // Trouver le dernier numéro de facture pour ce mois
        const lastOrder = await this.constructor.findOne(
            {},
            {},
            { sort: { 'invoiceNumber': -1 } }
        );

        let nextNumber = 1;

        if (lastOrder && lastOrder.invoiceNumber) {
            const lastNumberStr = lastOrder.invoiceNumber.slice(-4);
            nextNumber = parseInt(lastNumberStr) + 1;
        }

        this.invoiceNumber = `INV-${year}${month}-${String(nextNumber).padStart(4, '0')}`;
    }
    next();
});

// Méthode pour calculer le total
orderSchema.methods.calculateTotal = function () {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const Order = mongoose.model('Order', orderSchema);

export default Order;