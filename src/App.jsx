import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import PropertyDetails from './pages/dashboard/PropertyDetails';
import CreateProperty from './pages/dashboard/CreateProperty'; // <--- IMPORTAR

// Componente para proteger rutas privadas (Guard)
// Si no hay token en localStorage, redirige al login.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Privadas: Dashboard (Requieren Token) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Página Principal del Dashboard */}
          <Route index element={<DashboardHome />} />
          
          {/* Nueva Propiedad */}
          <Route path="properties/new" element={<CreateProperty />} /> {/* <--- NUEVA RUTA */}
          
          {/* Detalle de Propiedad */}
          <Route path="properties/:id" element={<PropertyDetails />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;