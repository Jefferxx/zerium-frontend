import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { getMyProperties } from '../../services/propertyService';

export default function PropertiesList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProperties() {
            try {
                const data = await getMyProperties();
                setProperties(data);
            } catch (error) {
                console.error("Error cargando propiedades:", error);
            } finally {
                setLoading(false);
            }
        }
        loadProperties();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">

            {/* Encabezado */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mis Propiedades</h1>
                    <p className="text-gray-500">Gestiona tus edificios y casas</p>
                </div>
                <Link
                    to="/dashboard/properties/new"
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" /> Nueva Propiedad
                </Link>
            </div>

            {/* Estado Vacío */}
            {properties.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No tienes propiedades aún</h3>
                    <p className="text-gray-500 mb-6">Empieza registrando tu primer inmueble.</p>
                    <Link to="/dashboard/properties/new" className="text-primary font-medium hover:underline">
                        Crear ahora
                    </Link>
                </div>
            ) : (
                /* Grid de Propiedades */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                            {/* "Foto" (Placeholder con gradiente) */}
                            <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                                <Building2 className="w-10 h-10 text-gray-400 group-hover:scale-110 transition duration-300" />
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 truncate">{property.name}</h3>
                                    <span className="text-xs font-bold uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                        {property.type}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 flex items-center mb-4">
                                    <MapPin className="w-3 h-3 mr-1" /> {property.city}
                                </p>

                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        {property.units ? property.units.length : 0} Unidades
                                    </span>
                                    <Link
                                        to={`/dashboard/properties/${property.id}`}
                                        className="text-primary text-sm font-medium flex items-center hover:gap-2 transition-all"
                                    >
                                        Ver Detalles <ArrowRight className="w-4 h-4 ml-1" />
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