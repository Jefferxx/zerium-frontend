import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import PropertiesList from './pages/dashboard/PropertiesList';
import PropertyDetails from './pages/dashboard/PropertyDetails';
import CreateProperty from './pages/dashboard/CreateProperty';
import CreateContract from './pages/dashboard/NewContract';
import ContractsList from './pages/dashboard/ContractList';
import ContractDetails from './pages/dashboard/ContractDetails';
import CreateTicket from './pages/dashboard/CreateTicket';
import TicketList from './pages/dashboard/TTicketList';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import VerificationPage from './pages/dashboard/VerificationPage';
// 1. IMPORTAMOS LA LANDING PAGE
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Helper opcional para redirigir si YA está logueado
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 2. RUTA RAÍZ (LANDING PAGE) */}
        <Route path="/" element={<LandingPage />} />

        {/* 3. RUTAS DE AUTENTICACIÓN (Protegidas para no entrar si ya tienes sesión) */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />

        {/* Rutas Privadas: Dashboard (Requieren Token) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />

          {/* Módulo de Propiedades */}
          <Route path="properties" element={<PropertiesList />} />
          <Route path="properties/new" element={<CreateProperty />} />
          <Route path="properties/:id" element={<PropertyDetails />} />

          {/* Módulo de Contratos */}
          <Route path="contracts/new" element={<CreateContract />} />
          <Route path="contracts" element={<ContractsList />} />
          <Route path="contracts/:id" element={<ContractDetails />} />

          {/* Mantenimiento */}
          <Route path="tickets/new" element={<CreateTicket />} />
          <Route path="tickets" element={<TicketList />} />

          <Route path="payments" element={<PaymentsPage />} />
          <Route path="verification" element={<VerificationPage />} />
        </Route>

        {/* Redirección por defecto: Si la ruta no existe, va a la Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;