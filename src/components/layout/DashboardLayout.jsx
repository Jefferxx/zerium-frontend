import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/authService';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Resumen', path: '/dashboard' },
    { icon: Building2, label: 'Propiedades', path: '/dashboard/properties' },
    { icon: Users, label: 'Inquilinos', path: '/dashboard/tenants' },
    { icon: FileText, label: 'Contratos', path: '/dashboard/contracts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Building2 className="w-8 h-8 text-primary mr-2" />
            <span className="text-xl font-bold text-gray-900">Zerium</span>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between">
          <span className="font-bold text-gray-900">Zerium</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Page Content (Outlet renderiza la página hija) */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}