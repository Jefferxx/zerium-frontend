import { useForm } from 'react-hook-form';
import { X, Save, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { updateUnit } from '../../services/propertyService';

export default function EditUnitModal({ unit, onClose, onUpdated }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      base_price: unit.base_price,
      bathrooms: Number(unit.bathrooms),
      bedrooms: unit.bedrooms,
      unit_number: unit.unit_number,
      area_m2: Number(unit.area_m2) || 0 // <--- 1. Cargar valor actual
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateUnit(unit.id, {
        base_price: parseFloat(data.base_price),
        bathrooms: parseFloat(data.bathrooms),
        bedrooms: parseInt(data.bedrooms),
        unit_number: data.unit_number,
        area_m2: parseFloat(data.area_m2) // <--- 2. Enviar al backend
      });
      
      onUpdated(); 
      onClose();   
    } catch (error) {
      alert("Error al actualizar la unidad");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Editar Unidad</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Número</label>
            <input {...register("unit_number")} className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
              <input type="number" step="0.01" {...register("base_price")} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            {/* --- 3. NUEVO CAMPO DE ÁREA --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
              <input type="number" step="0.01" {...register("area_m2")} className="w-full px-4 py-2 border rounded-lg" placeholder="Ej: 85" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
              <input type="number" {...register("bedrooms")} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
              <input type="number" step="0.5" {...register("bathrooms")} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}