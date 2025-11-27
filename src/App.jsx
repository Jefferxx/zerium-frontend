import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import PropertyDetails from './pages/dashboard/PropertyDetails';
import CreateProperty from './pages/dashboard/CreateProperty';
import CreateContract from './pages/dashboard/CreateContract'; // <--- Importación Nueva

// Componente para proteger rutas privadas
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
          {/* 1. Resumen General */}
          <Route index element={<DashboardHome />} />
          
          {/* 2. Módulo de Propiedades */}
          <Route path="properties/new" element={<CreateProperty />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          
          {/* 3. Módulo de Contratos (NUEVA RUTA) */}
          <Route path="contracts/new" element={<CreateContract />} />
          
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;