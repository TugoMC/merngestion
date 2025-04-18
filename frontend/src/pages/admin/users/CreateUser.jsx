import UserForm from './UserForm';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function CreateUser() {
    const { user } = useAuth();

    // Redirection si l'utilisateur n'est pas admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <UserForm isEdit={false} />;
}

export default CreateUser;