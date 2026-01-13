import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Wrench, Plus, Filter, Clock, CheckCircle,
  AlertTriangle, Loader2, PlayCircle, XCircle, Home
} from 'lucide-react';
import { createTicket, getMyTickets, updateTicketStatus } from '../../services/ticketService'; // Asegurate que createTicket existe en tu servicio
import { getMyContracts } from '../../services/contractService';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [contracts, setContracts] = useState([]); // Para el select
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  // Formulario
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    loadData(userRole);
  }, []);

  async function loadData(userRole) {
    try {
      const ticketsData = await getMyTickets();
      // Ordenar: Recientes primero
      setTickets(ticketsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

      if (userRole === 'tenant') {
        const contractsData = await getMyContracts();
        // Solo contratos activos
        setContracts(contractsData.filter(c => ['active', 'signed_by_tenant'].includes(c.status)));
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createTicket({
        title: data.title,
        description: data.description,
        priority: data.priority,
        unit_id: data.unit_id // Enviamos unit_id, el backend calcula el resto
      });

      alert("Ticket creado exitosamente");
      reset();
      setShowForm(false);

      // Recargar lista
      const updated = await getMyTickets();
      setTickets(updated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

    } catch (error) {
      console.error(error);
      alert("Error al crear ticket. Verifica que seleccionaste una propiedad válida.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    if (!window.confirm("¿Cambiar estado del ticket?")) return;
    try {
      await updateTicketStatus(ticketId, newStatus);
      // Actualización optimista local
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    } catch (error) {
      alert("Error actualizando estado");
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'all' ? true : t.status === filter);

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mantenimiento</h1>
          <p className="text-gray-500">Reportes e incidencias.</p>
        </div>

        {/* BOTÓN CREAR (Solo Inquilinos) */}
        {role === 'tenant' && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nuevo Reporte
          </button>
        )}
      </div>

      {/* FORMULARIO DE CREACIÓN (Expandible) */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Wrench className="w-5 h-5 text-primary" /> Crear Ticket</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Propiedad Afectada</label>
              <select {...register("unit_id", { required: true })} className="w-full border p-2 rounded-lg">
                <option value="">Selecciona tu vivienda...</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.unit_id}>
                    {c.unit?.property?.name || "Propiedad"} - {c.unit?.unit_number}
                  </option>
                ))}
              </select>
              {contracts.length === 0 && <p className="text-xs text-red-500 mt-1">No tienes contratos activos.</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <input {...register("title", { required: true })} placeholder="Título (ej: Fuga en baño)" className="w-full border p-2 rounded-lg" />
            </div>

            <div>
              <select {...register("priority")} className="w-full border p-2 rounded-lg">
                <option value="low">Prioridad Baja</option>
                <option value="medium">Prioridad Media</option>
                <option value="high">Prioridad Alta</option>
                <option value="emergency">Emergencia</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <textarea {...register("description", { required: true })} placeholder="Describe el problema..." className="w-full border p-2 rounded-lg" rows="3"></textarea>
            </div>

            <button disabled={submitting} type="submit" className="bg-primary text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition md:col-span-2">
              {submitting ? "Enviando..." : "Enviar Reporte"}
            </button>
          </form>
        </div>
      )}

      {/* FILTROS */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100">
        {['all', 'pending', 'in_progress', 'resolved'].map(f => (
          <button
            key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm capitalize ${filter === f ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="grid gap-4">
        {filteredTickets.map(t => (
          <div key={t.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-4">
              {/* Icono estado */}
              <div className={`p-3 rounded-full h-fit 
                  ${t.status === 'resolved' ? 'bg-green-100 text-green-600' :
                  t.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                {t.status === 'resolved' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>

              <div>
                <h3 className="font-bold text-gray-900">{t.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{t.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(t.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Home className="w-3 h-3" /> {t.property_name || "Propiedad"} - {t.unit_number}</span>
                  {role === 'landlord' && <span className="text-gray-600 font-medium">Por: {t.requester_name}</span>}
                </div>
              </div>
            </div>

            {/* Acciones Dueño */}
            {role === 'landlord' && t.status !== 'resolved' && (
              <div className="flex flex-col justify-center gap-2 min-w-[120px]">
                {t.status === 'pending' && (
                  <button onClick={() => handleStatusChange(t.id, 'in_progress')} className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-bold">En Proceso</button>
                )}
                <button onClick={() => handleStatusChange(t.id, 'resolved')} className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-bold">Resolver</button>
              </div>
            )}

            {/* Badge Estado Inquilino */}
            {role === 'tenant' && (
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border 
                   ${t.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600'}`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        ))}
        {filteredTickets.length === 0 && <div className="text-center text-gray-400 py-10">No hay tickets.</div>}
      </div>
    </div>
  );
}