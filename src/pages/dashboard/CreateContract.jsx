import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyProperties } from '../../services/propertyService';
import { createContract } from '../../services/contractService';
import { FileText, User, Calendar, DollarSign, Save, Loader2, ArrowLeft, Building, AlertCircle } from 'lucide-react';

export default function CreateContract() {
  const { register, handleSubmit, watch, setValue, setError, formState: { errors } } = useForm();
  const [properties, setProperties] = useState([]);
  // Eliminada la variable 'selectedProperty' que no se usaba
  const [availableUnits, setAvailableUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Cargar propiedades del usuario al inicio
  useEffect(() => {
    async function loadProps() {
      try {
        const data = await getMyProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error cargando propiedades", error);
        setServerError("Error al cargar tus propiedades. Intenta recargar la página.");
      }
    }
    loadProps();
  }, []);

  // 2. Lógica de Auto-selección (Si venimos del botón "Alquilar")
  const propertyIdParam = searchParams.get('propertyId');
  const unitIdParam = searchParams.get('unitId');

  useEffect(() => {
    if (properties.length > 0 && propertyIdParam) {
      setValue("property_id", propertyIdParam);
      
      const prop = properties.find(p => p.id === propertyIdParam);
      if (prop) {
        // Eliminada la asignación a selectedProperty
        const units = prop.units.filter(u => u.status === 'available');
        setAvailableUnits(units);

        if (unitIdParam) {
          const isUnitAvailable = units.some(u => u.id === unitIdParam);
          if (isUnitAvailable) {
             setTimeout(() => {
                 setValue("unit_id", unitIdParam);
                 const targetUnit = units.find(u => u.id === unitIdParam);
                 if(targetUnit) setValue("amount", targetUnit.base_price);
             }, 100);
          } else {
              setServerError("La unidad seleccionada no está disponible o no existe.");
          }
        }
      }
    }
  }, [properties, propertyIdParam, unitIdParam, setValue]);

  // 3. Manejar cambio manual de propiedad
  const watchedPropertyId = watch("property_id");
  useEffect(() => {
    if (watchedPropertyId && watchedPropertyId !== propertyIdParam) {
        const prop = properties.find(p => p.id === watchedPropertyId);
        // Eliminada la asignación a selectedProperty
        setAvailableUnits(prop?.units.filter(u => u.status === 'available') || []);
        setValue("unit_id", ""); 
        setValue("amount", "");
    }
  }, [watchedPropertyId, properties, setValue, propertyIdParam]);

  // 4. Actualizar precio al cambiar unidad manualmente
  const watchedUnitId = watch("unit_id");
  useEffect(() => {
      if(watchedUnitId) {
          const unit = availableUnits.find(u => u.id === watchedUnitId);
          if(unit) setValue("amount", unit.base_price);
      }
  }, [watchedUnitId, availableUnits, setValue]);


  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    
    if (new Date(data.start_date) > new Date(data.end_date)) {
        setError("end_date", { type: "manual", message: "La fecha fin debe ser posterior a la de inicio" });
        setIsLoading(false);
        return;
    }

    try {
      const payload = {
        unit_id: data.unit_id,
        tenant_email: data.tenant_email,
        start_date: data.start_date,
        end_date: data.end_date,
        payment_day: parseInt(data.payment_day),
        amount: parseFloat(data.amount)
      };

      await createContract(payload);
      alert("¡Contrato creado exitosamente! La unidad ahora figura como ocupada.");
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 404) {
        setServerError("El inquilino no existe. Debe registrarse primero en Zerium con ese correo.");
      } else if (error.response?.status === 400) {
        setServerError("La unidad ya no está disponible o hay un conflicto de fechas.");
      } else {
        setServerError("Error al crear el contrato. Verifica los datos e intenta nuevamente.");
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Contrato</h1>
          <p className="text-sm text-gray-500">Formaliza el alquiler de una unidad</p>
        </div>
      </div>

      {/* Mensaje de Error */}
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
        {/* SECCIÓN 1: PROPIEDAD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" /> Inmueble a Alquilar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Edificio / Casa</label>
              <select 
                {...register("property_id", { required: "Selecciona una propiedad" })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white transition"
              >
                <option value="">Seleccionar...</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad Disponible</label>
              <select 
                {...register("unit_id", { required: "Selecciona una unidad" })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400 transition"
                disabled={!watchedPropertyId || availableUnits.length === 0}
              >
                <option value="">Seleccionar...</option>
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.unit_number} (Base: ${u.base_price})
                  </option>
                ))}
              </select>
              {watchedPropertyId && availableUnits.length === 0 && (
                <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 p-2 rounded">
                  ⚠️ No hay unidades disponibles en este edificio.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: INQUILINO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Datos del Inquilino
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              {...register("tenant_email", { 
                required: "El email es obligatorio", 
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email inválido"
                }
              })}
              type="email"
              placeholder="inquilino@ejemplo.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded text-blue-700">
              ℹ️ El inquilino debe tener una cuenta registrada en Zerium.
            </p>
            {errors.tenant_email && <p className="text-red-500 text-xs mt-1">{errors.tenant_email.message}</p>}
          </div>
        </div>

        {/* SECCIÓN 3: CONDICIONES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Condiciones del Contrato
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  {...register("start_date", { required: "Fecha de inicio obligatoria" })}
                  type="date"
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  {...register("end_date", { required: "Fecha fin obligatoria" })}
                  type="date"
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
              {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canon Mensual ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  {...register("amount", { required: "Monto obligatorio", min: 1 })}
                  type="number" step="0.01"
                  placeholder="0.00"
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Día de Pago (1-31)</label>
              <input 
                {...register("payment_day", { required: true, min: 1, max: 31 })}
                type="number"
                defaultValue="5"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">Día límite para pagar cada mes.</p>
            </div>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-primary text-white py-3 px-10 rounded-xl font-semibold hover:bg-secondary transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Crear Contrato</>}
          </button>
        </div>

      </form>
    </div>
  );
}