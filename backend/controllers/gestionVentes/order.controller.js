import Order from '../../models/gestionVentes/order.model.js';
import Product from '../../models/gestionStock/product.model.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le dossier pour stocker les factures s'il n'existe pas
const invoicesDir = path.join(__dirname, '../../invoices');
if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
}

// Récupérer toutes les commandes
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.product', 'name sku price')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
    }
};

// Récupérer une commande par son ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name sku price');

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: error.message });
    }
};

// Créer une nouvelle commande
export const createOrder = async (req, res) => {
    try {
        const { customer, items, paymentMethod, notes } = req.body;

        if (!customer || !items || !items.length || !paymentMethod) {
            return res.status(400).json({ message: 'Données de commande incomplètes' });
        }

        // Vérifier et mettre à jour le stock pour chaque produit
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Produit non trouvé: ${item.product}` });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Stock insuffisant pour ${product.name}. Disponible: ${product.quantity}, Demandé: ${item.quantity}`
                });
            }

            // Ajouter le prix actuel du produit à l'item
            item.price = product.price;

            // Mettre à jour le stock
            product.quantity -= item.quantity;
            await product.save();
        }

        // Calculer le montant total
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Créer la commande
        const newOrder = new Order({
            customer,
            items,
            totalAmount,
            paymentMethod,
            notes
        });

        await newOrder.save();

        res.status(201).json({
            message: 'Commande créée avec succès',
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
    }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Le statut est requis' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        res.status(200).json({
            message: 'Statut de la commande mis à jour avec succès',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la commande', error: error.message });
    }
};

// Mettre à jour le statut de paiement
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        if (!paymentStatus) {
            return res.status(400).json({ message: 'Le statut de paiement est requis' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        res.status(200).json({
            message: 'Statut de paiement mis à jour avec succès',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de paiement', error: error.message });
    }
};

// Générer une facture PDF
export const generateInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer la commande avec les détails des produits
        const order = await Order.findById(id)
            .populate('items.product', 'name sku price');

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        // Créer le nom du fichier PDF
        const invoiceFileName = `facture-${order.invoiceNumber}.pdf`;
        const invoicePath = path.join(invoicesDir, invoiceFileName);

        // Créer un nouveau document PDF
        const doc = new PDFDocument({ margin: 50 });

        // Pipe le PDF vers un fichier
        const stream = fs.createWriteStream(invoicePath);
        doc.pipe(stream);

        // En-tête de la facture
        doc.fontSize(25).text('FACTURE', { align: 'center' });
        doc.moveDown();

        // Informations de l'entreprise
        doc.fontSize(12).text('Votre Entreprise', { align: 'left' });
        doc.fontSize(10)
            .text('123 Rue du Commerce')
            .text('75000 Paris')
            .text('Email: contact@votreentreprise.com')
            .text(`Date: ${new Date().toLocaleDateString('fr-FR')}`);

        doc.moveDown();

        // Informations du client
        doc.fontSize(12).text('Informations Client', { align: 'left' });
        doc.fontSize(10)
            .text(`Nom: ${order.customer.name}`)
            .text(`Email: ${order.customer.email}`)
            .text(`Adresse: ${order.customer.address}`)
            .text(`Téléphone: ${order.customer.phone || 'Non spécifié'}`);

        doc.moveDown();

        // Détails de la commande
        doc.fontSize(12).text(`Facture N°: ${order.invoiceNumber}`, { align: 'left' });
        doc.fontSize(10).text(`Date de commande: ${order.createdAt.toLocaleDateString('fr-FR')}`);

        doc.moveDown();

        // Tableau des produits
        const tableTop = 300;
        const itemCodeX = 50;
        const descriptionX = 150;
        const quantityX = 350;
        const priceX = 400;
        const amountX = 450;

        doc.fontSize(10)
            .text('Code', itemCodeX, tableTop)
            .text('Description', descriptionX, tableTop)
            .text('Qté', quantityX, tableTop)
            .text('Prix', priceX, tableTop)
            .text('Total', amountX, tableTop);

        // Ligne horizontale
        doc.moveTo(50, tableTop + 15)
            .lineTo(550, tableTop + 15)
            .stroke();

        let position = tableTop + 30;

        // Liste des articles
        order.items.forEach(item => {
            doc.fontSize(10)
                .text(item.product.sku, itemCodeX, position)
                .text(item.product.name, descriptionX, position)
                .text(item.quantity.toString(), quantityX, position)
                .text(`${item.price.toFixed(2)} FCFA`, priceX, position)
                .text(`${(item.quantity * item.price).toFixed(2)} FCFA`, amountX, position);

            position += 20;
        });

        // Ligne horizontale
        doc.moveTo(50, position + 5)
            .lineTo(550, position + 5)
            .stroke();

        // Total
        doc.fontSize(12)
            .text('Total:', 350, position + 20)
            .text(`${order.totalAmount.toFixed(2)} FCFA`, amountX, position + 20);

        // Pied de page
        doc.fontSize(10)
            .text('Merci pour votre commande !', 50, position + 60, { align: 'center' })
            .text('Pour toute question concernant cette facture, veuillez nous contacter.', 50, position + 80, { align: 'center' });

        // Finaliser le document
        doc.end();

        // Attendre que le stream soit fini
        stream.on('finish', () => {
            res.status(200).json({
                message: 'Facture générée avec succès',
                invoiceUrl: `/api/orders/${id}/invoice/download`,
                invoicePath: invoicePath
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la génération de la facture', error: error.message });
    }
};

// Télécharger la facture PDF
export const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer la commande
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        // Chemin vers le fichier PDF
        const invoiceFileName = `facture-${order.invoiceNumber}.pdf`;
        const invoicePath = path.join(invoicesDir, invoiceFileName);

        // Vérifier si le fichier existe
        if (!fs.existsSync(invoicePath)) {
            return res.status(404).json({ message: 'Facture non trouvée, veuillez d\'abord la générer' });
        }

        // Envoyer le fichier
        res.download(invoicePath, invoiceFileName);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du téléchargement de la facture', error: error.message });
    }
};