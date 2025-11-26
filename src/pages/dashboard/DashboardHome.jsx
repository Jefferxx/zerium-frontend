import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importante para la navegación
import { getMyProperties } from '../../services/propertyService';
import { Building, Home, MapPin, Loader2, Plus } from 'lucide-react';

export default function DashboardHome() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar el componente
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMyProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error cargando propiedades:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con Título y Botón de Acción */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Resumen General</h1>
        
        <Link 
          to="/dashboard/properties/new" 
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-secondary transition flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nueva Propiedad
        </Link>
      </div>

      {/* Tarjetas de Estadísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total de Propiedades */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Propiedades</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{properties.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Building className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Unidades Ocupadas (Dato simulado por ahora, luego lo calcularemos) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Unidades Ocupadas</p>
              <p className="text-3xl font-bold text-green-600 mt-1">2</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Home className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Edificios/Casas */}
      <h2 className="text-xl font-bold text-gray-900 mt-8">Mis Edificios</h2>
      
      {properties.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No tienes propiedades registradas aún.</p>
          <Link to="/dashboard/properties/new" className="mt-4 inline-block text-primary font-semibold hover:underline">
            + Crear mi primera propiedad
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Imagen de Portada (Placeholder generado con el nombre) */}
              <div className="h-32 bg-gray-200 relative">
                  <img 
                      src={`https://ui-avatars.com/api/?name=${prop.name}&background=random&size=400&font-size=0.33`} 
                      alt="Property placeholder" 
                      className="w-full h-full object-cover opacity-90"
                  />
                  <span className="absolute top-3 right-3 bg-white px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide text-gray-700 shadow-sm">
                      {prop.type}
                  </span>
              </div>

              {/* Contenido de la Tarjeta */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 truncate" title={prop.name}>
                  {prop.name}
                </h3>
                
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {prop.address ? `${prop.address}, ${prop.city}` : prop.city}
                  </span>
                </div>

                {/* Footer de la Tarjeta */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                      {prop.units ? prop.units.length : 0} Unidades
                  </span>
                  
                  {/* Botón de Ver Detalles (Enlace) */}
                  <Link 
                      to={`/dashboard/properties/${prop.id}`}
                      className="text-primary text-sm font-semibold hover:underline"
                  >
                      Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}