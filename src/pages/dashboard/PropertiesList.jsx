import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, MapPin, Loader2, ArrowRight, AlertTriangle, Home, Store, Building } from 'lucide-react';
import { getMyProperties } from '../../services/propertyService';

// --- NUEVO: Función para obtener imágenes según el tipo ---
const getPropertyImage = (type) => {
    // Imágenes reales de Unsplash para cada caso
    const images = {
        apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        house: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
        commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        building: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        store: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
    };
    // Retorna la imagen correspondiente o una por defecto (building)
    return images[type] || images.building;
};

// --- NUEVO: Función para iconos según el tipo ---
const getPropertyIcon = (type) => {
    const icons = {
        house: <Home className="w-4 h-4" />,
        store: <Store className="w-4 h-4" />,
        apartment: <Building2 className="w-4 h-4" />,
    };
    return icons[type] || <Building className="w-4 h-4" />;
};

export default function PropertiesList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadProperties() {
            try {
                const data = await getMyProperties();
                setProperties(data);
            } catch (err) {
                console.error("Error cargando propiedades:", err);
                // Si el error es 404 es porque no hay propiedades, no es un error critico
                if (err.response && err.response.status === 404) {
                    setProperties([]);
                } else {
                    setError("No pudimos conectar con el servidor. Intenta más tarde.");
                }
            } finally {
                setLoading(false);
            }
        }
        loadProperties();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

    if (error) return (
        <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200 mx-4 mt-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-red-900">Hubo un problema</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="text-red-700 font-bold underline hover:text-red-800">
                Recargar página
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mis Propiedades</h1>
                    <p className="text-gray-500 mt-1">Gestiona y supervisa tus inmuebles</p>
                </div>
                <Link
                    to="/dashboard/properties/new"
                    className="bg-primary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-medium"
                >
                    <Plus className="w-5 h-5" /> Nueva Propiedad
                </Link>
            </div>

            {/* Estado Vacío */}
            {properties.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">No tienes propiedades aún</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Comienza a digitalizar tu gestión inmobiliaria registrando tu primer edificio o casa.</p>
                    <Link to="/dashboard/properties/new" className="text-primary font-bold hover:underline text-lg">
                        Crear mi primera propiedad
                    </Link>
                </div>
            ) : (
                /* Grid de Propiedades */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">

                            {/* --- AQUÍ ESTÁ EL CAMBIO: IMAGEN REAL --- */}
                            <div className="h-48 relative overflow-hidden">
                                <img
                                    src={getPropertyImage(property.type)}
                                    alt={property.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

                                {/* Badge de Tipo */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/90 text-gray-900 backdrop-blur-md shadow-sm">
                                        {getPropertyIcon(property.type)}
                                        {property.type === 'store' ? 'Local' : property.type}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="font-bold text-xl text-gray-900 truncate mb-1">{property.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                        {property.address}, {property.city}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                                            {property.units ? property.units.length : 0} Unidades
                                        </span>
                                    </div>

                                    <Link
                                        to={`/dashboard/properties/${property.id}`}
                                        className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        Administrar <ArrowRight className="w-4 h-4" />
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