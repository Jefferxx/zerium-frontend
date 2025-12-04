import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import PropertyDetails from './pages/dashboard/PropertyDetails';
import CreateProperty from './pages/dashboard/CreateProperty';
import CreateContract from './pages/dashboard/NewContract';
import ContractsList from './pages/dashboard/ContractList';
import ContractDetails from './pages/dashboard/ContractDetails';
import CreateTicket from './pages/dashboard/CreateTicket'; // ✅ Import correcto

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Privadas: Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* 1. Resumen */}
          <Route index element={<DashboardHome />} />
          
          {/* 2. Propiedades */}
          <Route path="properties/new" element={<CreateProperty />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          
          {/* 3. Contratos */}
          <Route path="contracts/new" element={<CreateContract />} />
          <Route path="contracts" element={<ContractsList />} />
          <Route path="contracts/:id" element={<ContractDetails />} />
          
          {/* 4. Mantenimiento (Tickets) */}
          <Route path="tickets/new" element={<CreateTicket />} /> {/* ✅ AQUÍ VA */}
          
        </Route>

        {/* Redirección */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;