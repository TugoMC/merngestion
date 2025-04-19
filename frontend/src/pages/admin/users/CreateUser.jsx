import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import UserForm from './UserForm';

function CreateUser() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user || user.role !== 'admin') {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-orange-50 border-l-4 border-orange-500 text-gray-700 p-4 rounded">
                    <p className="font-bold">Accès refusé</p>
                    <p>Vous devez être administrateur pour accéder à cette page.</p>
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return <UserForm isEdit={false} />;
}

export default CreateUser;