import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../../services/propertyService';
import { Building2, MapPin, Save, Loader2, ArrowLeft, Home, LayoutGrid, AlertCircle } from 'lucide-react';

const ECUADOR_PROVINCES = [
  "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", 
  "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona Santiago", 
  "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo", 
  "Sucumbíos", "Tungurahua", "Zamora Chinchipe"
];

export default function CreateProperty() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      city: "Riobamba",
      province: "Chimborazo",
      type: "house",
      avg_price: 350 // Valor por defecto para evitar error de validación gt=0
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const propertyType = watch("type");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // 1. Construir Dirección Completa
      const fullAddress = `${data.main_street} y ${data.secondary_street}`;
      const cityFull = `${data.city}, ${data.province} (CP: ${data.zip_code || 'S/N'})`;

      // 2. Validación de Precio (Pydantic exige > 0)
      const price = parseFloat(data.avg_price);
      if (price <= 0) {
        throw new Error("El precio promedio debe ser mayor a 0");
      }

      // 3. Generar Unidades Automáticas
      let generatedUnits = [];

      if (data.type === 'house') {
        generatedUnits.push({
          unit_number: "Casa Unica",
          type: "house",
          base_price: price,
          bedrooms: parseInt(data.bedrooms) || 3,
          bathrooms: parseFloat(data.bathrooms) || 1,
          status: "available"
        });
      } else if (data.type === 'building') {
        const numUnits = parseInt(data.num_units) || 2;
        for (let i = 1; i <= numUnits; i++) {
          generatedUnits.push({
            unit_number: `Depto ${i}`,
            type: "apartment",
            base_price: price, // Precio base sugerido
            bedrooms: 2,       // Valor por defecto
            bathrooms: 1,      // Valor por defecto
            status: "available"
          });
        }
      }

      // 4. Payload final para la API
      const payload = {
        name: data.name,
        type: data.type,
        city: cityFull,
        address: fullAddress,
        description: data.description,
        // Enviamos lat/lng por defecto porque el backend lo espera (Optional pero recomendado)
        latitude: -1.6635, 
        longitude: -78.6546,
        amenities: {},
        units: generatedUnits
      };

      await createProperty(payload);
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Error:", error);
      // Extraer mensaje de error útil del backend (si es 422 o 400)
      let message = "Ocurrió un error inesperado.";
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          // Error de validación Pydantic (lista de campos)
          message = `Error en el campo: ${detail[0].loc.join('.')} - ${detail[0].msg}`;
        } else {
          message = detail;
        }
      } else if (error.message) {
        message = error.message;
      }
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Propiedad</h1>
          <p className="text-sm text-gray-500">Complete los datos para registrar el inmueble</p>
        </div>
      </div>

      {/* Mensaje de Error del Servidor */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-pulse">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">No se pudo guardar</p>
            <p className="text-sm">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* CARD 1: INFORMACIÓN BÁSICA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Información General
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial</label>
              <input
                {...register("name", { required: "El nombre es obligatorio" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                placeholder="Ej: Edificio Altamira"
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Inmueble</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Opción Casa */}
                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${propertyType === 'house' ? 'border-primary bg-blue-50/50' : 'border-gray-100 hover:border-gray-300'}`}>
                  <input {...register("type")} type="radio" value="house" className="hidden" />
                  <div className={`p-2 rounded-full ${propertyType === 'house' ? 'bg-white text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    <Home className="w-6 h-6" />
                  </div>
                  <span className={`font-medium ${propertyType === 'house' ? 'text-primary' : 'text-gray-600'}`}>Casa Unifamiliar</span>
                </label>

                {/* Opción Edificio */}
                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${propertyType === 'building' ? 'border-primary bg-blue-50/50' : 'border-gray-100 hover:border-gray-300'}`}>
                  <input {...register("type")} type="radio" value="building" className="hidden" />
                  <div className={`p-2 rounded-full ${propertyType === 'building' ? 'bg-white text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <span className={`font-medium ${propertyType === 'building' ? 'text-primary' : 'text-gray-600'}`}>Edificio de Deptos</span>
                </label>
              </div>
            </div>

            {/* Campos Dinámicos */}
            {propertyType === 'building' && (
              <div className="col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-blue-900 mb-1">¿Cuántos departamentos tiene?</label>
                <input
                  {...register("num_units", { required: true, min: 2 })}
                  type="number"
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Ej: 10"
                />
                <p className="text-xs text-blue-600 mt-1">Se crearán automáticamente las unidades (Depto 1, Depto 2...).</p>
              </div>
            )}

            {propertyType === 'house' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
                  <input {...register("bedrooms")} type="number" defaultValue="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
                  <input {...register("bathrooms")} type="number" step="0.5" defaultValue="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* CARD 2: UBICACIÓN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Dirección Exacta
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
              <select {...register("province")} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none">
                {ECUADOR_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input 
                {...register("city", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Calle Principal</label>
              <input 
                {...register("main_street", { required: "Calle principal obligatoria" })}
                placeholder="Ej: Av. Daniel León Borja"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Calle Secundaria</label>
              <input 
                {...register("secondary_street", { required: "Calle secundaria obligatoria" })}
                placeholder="Ej: Lavalle"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal (Opcional)</label>
              <input 
                {...register("zip_code")}
                placeholder="Ej: 060101"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: VALOR REFERENCIAL */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Canon de Arrendamiento</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Promedio ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input 
                {...register("avg_price", { required: true, min: 1 })}
                type="number" step="0.01"
                className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Este valor se asignará inicialmente a las unidades.</p>
          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-primary text-white py-3 px-10 rounded-xl font-semibold hover:bg-secondary transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar Propiedad</>}
          </button>
        </div>

      </form>
    </div>
  );
}