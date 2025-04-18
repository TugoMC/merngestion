import { useParams } from 'react-router-dom';
import UserForm from './UserForm';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function EditUser() {
    const { id } = useParams();
    const { user } = useAuth();

    // Redirection si l'utilisateur n'est pas admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <UserForm userId={id} isEdit={true} />;
}

export default EditUser;