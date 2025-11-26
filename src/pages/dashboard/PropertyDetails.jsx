import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../services/propertyService';
import { Building2, MapPin, Bed, Bath, Maximize, ArrowLeft, Loader2 } from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
  if (!property) return <div className="text-center p-10">Propiedad no encontrada</div>;

  return (
    <div className="space-y-6">
      {/* Header y Botón Volver */}
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver
      </button>

      {/* Ficha del Edificio */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative p-8 flex items-end">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold uppercase">
            {property.type}
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold">{property.name}</h1>
            <p className="flex items-center text-blue-100 mt-1">
              <MapPin className="w-4 h-4 mr-1" /> {property.address}, {property.city}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Unidades */}
      <h2 className="text-xl font-bold text-gray-900">Unidades Disponibles ({property.units.length})</h2>
      
      <div className="grid gap-4">
        {property.units.map((unit) => (
          <div key={unit.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center hover:shadow-md transition">
            
            {/* Info Izquierda */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className={`p-3 rounded-full ${unit.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Unidad {unit.unit_number}</h3>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                  {unit.status === 'available' ? 'Disponible' : 'Ocupado'}
                </p>
              </div>
            </div>

            {/* Características (Iconos) */}
            <div className="flex gap-6 text-gray-600 text-sm my-4 md:my-0">
              <div className="flex items-center" title="Habitaciones"><Bed className="w-4 h-4 mr-1.5" /> {unit.bedrooms}</div>
              <div className="flex items-center" title="Baños"><Bath className="w-4 h-4 mr-1.5" /> {Number(unit.bathrooms)}</div>
              <div className="flex items-center" title="Área"><Maximize className="w-4 h-4 mr-1.5" /> {Number(unit.area_m2)} m²</div>
            </div>

            {/* Precio y Acción */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <div className="text-right">
                <p className="text-xs text-gray-400">Precio Base</p>
                <p className="text-xl font-bold text-primary">${unit.base_price}</p>
              </div>
              <button className="bg-gray-50 text-gray-700 hover:bg-primary hover:text-white px-4 py-2 rounded-lg transition text-sm font-medium">
                Gestionar
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}