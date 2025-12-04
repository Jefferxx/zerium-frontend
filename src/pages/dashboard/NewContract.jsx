import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyProperties } from '../../services/propertyService';
import { createContract } from '../../services/contractService';
import { getTenantIdByEmail } from '../../services/userService'; // Importamos la nueva función
import { FileText, User, Calendar, DollarSign, Save, Loader2, ArrowLeft, Building, AlertCircle } from 'lucide-react';

export default function NewContract() {
  const { register, handleSubmit, watch, setValue, setError, formState: { errors } } = useForm();
  const [properties, setProperties] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Cargar propiedades al inicio
  useEffect(() => {
    async function loadProps() {
      try {
        const data = await getMyProperties();
        setProperties(data);
      } catch (error) {
        setServerError("Error al cargar propiedades.");
      }
    }
    loadProps();
  }, []);

  // 2. Lógica de Auto-selección desde URL (Dashboard -> Alquilar)
  const propertyIdParam = searchParams.get('propertyId');
  const unitIdParam = searchParams.get('unitId');

  useEffect(() => {
    if (properties.length > 0 && propertyIdParam) {
      setValue("property_id", propertyIdParam);
      const prop = properties.find(p => p.id === propertyIdParam);
      if (prop) {
        // Filtramos solo las disponibles
        const units = prop.units.filter(u => u.status === 'available');
        setAvailableUnits(units);

        if (unitIdParam) {
           setTimeout(() => {
               setValue("unit_id", unitIdParam);
               const targetUnit = units.find(u => u.id === unitIdParam);
               if(targetUnit) setValue("amount", targetUnit.base_price);
           }, 100);
        }
      }
    }
  }, [properties, propertyIdParam, unitIdParam, setValue]);

  // 3. Manejo manual de cambios en el select de Propiedad
  const watchedPropertyId = watch("property_id");
  useEffect(() => {
    if (watchedPropertyId && watchedPropertyId !== propertyIdParam) {
        const prop = properties.find(p => p.id === watchedPropertyId);
        setAvailableUnits(prop?.units.filter(u => u.status === 'available') || []);
        setValue("unit_id", ""); 
        setValue("amount", "");
    }
  }, [watchedPropertyId, properties, propertyIdParam, setValue]);

  // --- SUBMIT ---
  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    
    if (new Date(data.start_date) > new Date(data.end_date)) {
        setError("end_date", { type: "manual", message: "La fecha fin debe ser posterior." });
        setIsLoading(false);
        return;
    }

    try {
      // PASO A: Traducir Email -> UUID
      const tenantId = await getTenantIdByEmail(data.tenant_email);
      
      if (!tenantId) {
        setError("tenant_email", { 
            type: "manual", 
            message: "Usuario no encontrado. El inquilino debe registrarse primero en Zerium." 
        });
        setIsLoading(false);
        return;
      }

      // PASO B: Armar el paquete para el Backend
      const payload = {
        unit_id: data.unit_id,
        tenant_id: tenantId,        // UUID real
        start_date: data.start_date,
        end_date: data.end_date,
        payment_day: parseInt(data.payment_day),
        amount: parseFloat(data.amount)
      };

      console.log("Enviando contrato:", payload); // Para depuración
      await createContract(payload);
      
      // Éxito
      alert("¡Contrato creado exitosamente!");
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error("Error creating contract:", error);
      if (error.response?.status === 400) {
        setServerError(error.response.data.detail || "Datos inválidos o unidad ocupada.");
      } else {
        setServerError("Ocurrió un error en el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Contrato</h1>
          <p className="text-sm text-gray-500">Formaliza el alquiler</p>
        </div>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECCIÓN PROPIEDAD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" /> Inmueble
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad</label>
              <select {...register("property_id", { required: true })} className="w-full px-4 py-2 border rounded-lg">
                <option value="">Seleccionar...</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
              <select {...register("unit_id", { required: true })} className="w-full px-4 py-2 border rounded-lg" disabled={!availableUnits.length}>
                <option value="">Seleccionar...</option>
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.unit_number} - ${u.base_price}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECCIÓN INQUILINO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Inquilino
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email del Inquilino</label>
            <input 
              {...register("tenant_email", { required: "Email requerido", pattern: /^\S+@\S+$/i })}
              type="email" placeholder="usuario@cliente.com"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Debe estar registrado previamente.</p>
            {errors.tenant_email && <p className="text-red-500 text-xs mt-1">{errors.tenant_email.message}</p>}
          </div>
        </div>

        {/* SECCIÓN DETALLES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Términos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
              <input type="date" {...register("start_date", { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input type="date" {...register("end_date", { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
              <input type="number" step="0.01" {...register("amount", { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Día de Pago</label>
              <input type="number" defaultValue="5" {...register("payment_day", { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="bg-primary text-white py-3 px-10 rounded-xl hover:bg-secondary transition disabled:opacity-50 flex gap-2">
             {isLoading ? <Loader2 className="animate-spin" /> : <Save />} Guardar Contrato
          </button>
        </div>
      </form>
    </div>
  );
}