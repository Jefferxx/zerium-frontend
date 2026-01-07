import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import PropertiesList from './pages/dashboard/PropertiesList'; // <--- 1. IMPORT NUEVO
import PropertyDetails from './pages/dashboard/PropertyDetails';
import CreateProperty from './pages/dashboard/CreateProperty';
import CreateContract from './pages/dashboard/NewContract';
import ContractsList from './pages/dashboard/ContractList';
import ContractDetails from './pages/dashboard/ContractDetails';
import CreateTicket from './pages/dashboard/CreateTicket';
import TicketList from './pages/dashboard/ticketList';

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
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas: Dashboard (Requieren Token) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* 1. Resumen General */}
          <Route index element={<DashboardHome />} />

          {/* 2. Módulo de Propiedades */}
          <Route path="properties" element={<PropertiesList />} /> {/* <--- 2. RUTA NUEVA */}
          <Route path="properties/new" element={<CreateProperty />} />
          <Route path="properties/:id" element={<PropertyDetails />} />

          {/* 3. Módulo de Contratos */}
          <Route path="contracts/new" element={<CreateContract />} />
          <Route path="contracts" element={<ContractsList />} />
          <Route path="contracts/:id" element={<ContractDetails />} />

          {/* 4. Mantenimiento */}
          <Route path="tickets/new" element={<CreateTicket />} />
          <Route path="tickets" element={<TicketList />} />

          <Route path="payments" element={<PaymentsPage />} />

        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;