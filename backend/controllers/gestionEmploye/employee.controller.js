import Employee from '../../models/gestionEmploye/employee.model.js';

// Récupérer tous les employés
export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des employés', error: error.message });
    }
};

// Récupérer un employé par son ID
export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé', error: error.message });
    }
};

// Créer un nouvel employé
export const createEmployee = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé: seul un administrateur peut créer un employé' });
        }

        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json({ message: 'Employé créé avec succès', employee });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'employé', error: error.message });
    }
};

// Mettre à jour un employé
export const updateEmployee = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé: seul un administrateur peut modifier un employé' });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }

        res.status(200).json({ message: 'Employé mis à jour avec succès', employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé', error: error.message });
    }
};

// Supprimer un employé
export const deleteEmployee = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé: seul un administrateur peut supprimer un employé' });
        }

        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }

        res.status(200).json({ message: 'Employé supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé', error: error.message });
    }
};

// Rechercher des employés
export const searchEmployees = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Paramètre de recherche manquant' });
        }

        const searchRegex = new RegExp(query, 'i');

        const employees = await Employee.find({
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { position: searchRegex },
                { department: searchRegex }
            ]
        });

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche d\'employés', error: error.message });
    }
};