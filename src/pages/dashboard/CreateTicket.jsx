import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyProperties } from '../../services/propertyService';
import { createTicket } from '../../services/ticketService';
import { Wrench, AlertTriangle, Save, Loader2, ArrowLeft, Building } from 'lucide-react';

export default function CreateTicket() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get('propertyId');

  // Cargar propiedades al inicio
  useEffect(() => {
    async function loadProps() {
      try {
        const data = await getMyProperties();
        setProperties(data);
        // Si viene pre-seleccionado desde la URL
        if (propertyIdParam) {
          setValue("property_id", propertyIdParam);
        }
      } catch (error) {
        console.error("Error cargando propiedades", error);
      }
    }
    loadProps();
  }, [propertyIdParam, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        property_id: data.property_id,
        unit_id: null, // Por ahora reportamos a nivel edificio
        photo_url: null
      };

      await createTicket(payload);
      alert("¡Ticket de mantenimiento creado!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Error al crear el reporte. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportar Problema</h1>
          <p className="text-sm text-gray-500">Mantenimiento y Reparaciones</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* SECCIÓN 1: DÓNDE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" /> Ubicación
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad Afectada</label>
            <select 
              {...register("property_id", { required: "Selecciona una propiedad" })}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="">Seleccionar...</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.property_id && <p className="text-red-500 text-xs mt-1">{errors.property_id.message}</p>}
          </div>
        </div>

        {/* SECCIÓN 2: QUÉ PASÓ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" /> Detalle del Incidente
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título Corto</label>
            <input 
              {...register("title", { required: "El título es obligatorio" })}
              placeholder="Ej: Fuga de agua en baño"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Detallada</label>
            <textarea 
              {...register("description", { required: true })}
              rows="4"
              placeholder="Describe el problema, ubicación exacta, etc..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map((prio) => (
                <label key={prio} className={`
                  border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition
                  ${watch('priority') === prio ? 'ring-2 ring-primary bg-blue-50 border-primary' : 'border-gray-200'}
                `}>
                  <input type="radio" value={prio} {...register("priority")} className="hidden" defaultChecked={prio === 'medium'} />
                  <span className="capitalize text-sm font-medium text-gray-700">
                    {prio === 'low' ? 'Baja' : prio === 'medium' ? 'Media' : 'Alta 🚨'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isLoading} className="bg-red-600 text-white py-3 px-8 rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex gap-2 font-semibold shadow-lg shadow-red-200">
             {isLoading ? <Loader2 className="animate-spin" /> : <AlertTriangle className="w-5 h-5" />} Reportar Incidente
          </button>
        </div>
      </form>
    </div>
  );
}