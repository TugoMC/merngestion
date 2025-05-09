import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import EmployeeList from './pages/employees/EmployeeList';
import CreateEmployee from './pages/employees/CreateEmployee';
import EditEmployee from './pages/employees/EditEmployee';
import EmployeeDetails from './pages/employees/EmployeeDetails';
import ProductList from './pages/products/ProductList';
import CreateProduct from './pages/products/CreateProduct';
import EditProduct from './pages/products/EditProduct';
import ProductDetails from './pages/products/ProductDetails';
import OrderList from './pages/orders/OrderList';
import CreateOrder from './pages/orders/CreateOrder';
import OrderDetails from './pages/orders/OrderDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/users/UserList';
import CreateUser from './pages/admin/users/CreateUser';
import EditUser from './pages/admin/users/EditUser';
import UserDetails from './pages/admin/users/UserDetails';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto pt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />

          {/* Routes protégées - Employés */}
          <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
          <Route path="/employees/create" element={<ProtectedRoute><CreateEmployee /></ProtectedRoute>} />
          <Route path="/employees/edit/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
          <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />

          {/* Routes protégées - Produits */}
          <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/products/create" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
          <Route path="/products/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />

          {/* Routes protégées - Commandes */}
          <Route path="/orders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
          <Route path="/orders/create" element={<ProtectedRoute><CreateOrder /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

          {/* Routes d'administration */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Routes pour la gestion des utilisateurs */}
          <Route path="/admin/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/admin/users/create" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path="/admin/users/edit/:id" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;