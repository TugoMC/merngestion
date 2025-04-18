export const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: `Accès refusé: vous devez avoir le rôle ${role}` });
        }
        next();
    };
};

// Middleware pour vérifier si l'utilisateur est admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé: vous devez être administrateur' });
    }
    next();
};