import { useEffect, useState } from 'react';
import { getTickets, updateTicket } from '../../services/ticketService';
import { getMyProperties } from '../../services/propertyService';
import { Wrench, CheckCircle, AlertCircle, Clock, Filter, Building } from 'lucide-react';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, resolved

  useEffect(() => {
    async function loadData() {
      try {
        const [ticketsData, propsData] = await Promise.all([
          getTickets(),
          getMyProperties()
        ]);
        setTickets(ticketsData);
        setProperties(propsData);
      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Función para resolver ticket
  const handleResolve = async (id) => {
    if (!confirm("¿Marcar este problema como RESUELTO?")) return;
    
    // Actualización optimista (cambia en UI primero)
    setTickets(prev => prev.map(t => t.id === id ? { ...t, is_resolved: true } : t));

    try {
      await updateTicket(id, { is_resolved: true });
    } catch (error) {
      alert("Error al actualizar");
      // Revertir si falla
      setTickets(prev => prev.map(t => t.id === id ? { ...t, is_resolved: false } : t));
    }
  };

  // Helper para obtener nombre de propiedad
  const getPropertyName = (id) => {
    const prop = properties.find(p => p.id === id);
    return prop ? prop.name : 'Propiedad Desconocida';
  };

  // Filtrado
  const filteredTickets = tickets.filter(t => {
    if (filter === 'open') return !t.is_resolved;
    if (filter === 'resolved') return t.is_resolved;
    return true;
  });

  if (loading) return <div className="p-10 text-center">Cargando reportes...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mantenimiento</h1>
          <p className="text-sm text-gray-500">Gestión de incidentes y reparaciones</p>
        </div>
        
        {/* Filtros */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['all', 'open', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                filter === f ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'open' ? 'Pendientes' : 'Resueltos'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
            No hay tickets en esta categoría.
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className={`bg-white p-5 rounded-xl border-l-4 shadow-sm ${ticket.is_resolved ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-700' : 
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    {ticket.is_resolved ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                    {ticket.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">{ticket.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Building className="w-4 h-4" />
                    {getPropertyName(ticket.property_id)}
                  </div>
                </div>

                {!ticket.is_resolved && (
                  <button 
                    onClick={() => handleResolve(ticket.id)}
                    className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition shadow-sm"
                  >
                    Marcar Resuelto
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}