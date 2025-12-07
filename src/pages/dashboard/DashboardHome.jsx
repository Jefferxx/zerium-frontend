import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORTANTE: Necesario para los botones
import {
  Building2,
  Users,
  Wrench,
  TrendingUp,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getDashboardStats } from '../../services/dashboardService';
import { getCurrentRole } from '../../services/authService';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = getCurrentRole(); // 'landlord' o 'tenant'

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- VISTA PARA DUEÑO (LANDLORD) ---
  if (role === 'landlord') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen General</h1>
          <p className="text-gray-500">Bienvenido de nuevo, aquí está el estado de tu portafolio.</p>
        </div>

        {/* Tarjetas de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Propiedades */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Propiedades</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats?.total_properties || 0}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Unidades */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Unidades Totales</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats?.total_units || 0}</h3>
                <p className="text-xs text-gray-400 mt-1">{stats?.occupied_units} Ocupadas</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Ocupación */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Tasa de Ocupación</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats?.occupancy_rate || 0}%</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Mantenimiento */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Tickets Pendientes</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats?.pending_tickets || 0}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stats?.pending_tickets > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                <Wrench className={`w-6 h-6 ${stats?.pending_tickets > 0 ? 'text-red-600' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>

        </div>

        {/* Sección de Accesos Rápidos (CORREGIDA CON BOTONES REALES) */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          {/* Decoración de fondo */}
          <Building2 className="absolute -right-6 -bottom-6 w-40 h-40 text-white opacity-10" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">¿Qué quieres hacer hoy?</h2>
            <p className="text-blue-100 mb-6 max-w-lg">
              Gestiona tu portafolio de manera eficiente. Crea nuevas propiedades o registra contratos en segundos.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard/properties/new"
                className="bg-white text-blue-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-sm flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" /> Nueva Propiedad
              </Link>

              <Link
                to="/dashboard/contracts/new"
                className="bg-blue-800/50 text-white backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition border border-blue-400/30 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Nuevo Contrato
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA PARA INQUILINO (TENANT) ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Hogar</h1>
        <p className="text-gray-500">Resumen de tu alquiler y servicios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Contrato Activo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Estado del Contrato</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.active_contracts > 0 ? 'Activo' : 'Sin Contrato'}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${stats?.active_contracts > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {stats?.active_contracts > 0 ? <CheckCircle className="text-green-600" /> : <AlertCircle className="text-gray-400" />}
            </div>
          </div>
        </div>

        {/* Tickets Míos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Mis Reportes Abiertos</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.pending_tickets || 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}