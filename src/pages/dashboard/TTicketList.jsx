import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, Plus, Filter, Clock, CheckCircle, 
  AlertTriangle, Loader2, MoreVertical, PlayCircle, XCircle 
} from 'lucide-react';
import { getMyTickets, updateTicketStatus } from '../../services/ticketService';
import { getCurrentRole } from '../../services/authService';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'in_progress', 'resolved'
  const role = getCurrentRole();
  const [updatingId, setUpdatingId] = useState(null); // Para mostrar loading en el botón específico

  // Cargar tickets
  async function loadTickets() {
    try {
      const data = await getMyTickets();
      // Ordenar: Pendientes primero, luego En Progreso, luego Resueltos
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setTickets(sorted);
    } catch (error) {
      console.error("Error cargando tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  // Función para cambiar estado
  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      await updateTicketStatus(ticketId, newStatus);
      await loadTickets(); // Recargar la lista para ver cambios
    } catch (error) {
      console.error("Error actualizando ticket:", error);
      alert("No se pudo actualizar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrado visual
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  // Configuración de Colores y Textos según estado
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle, label: 'Pendiente' };
      case 'in_progress': return { color: 'bg-blue-100 text-blue-700', icon: PlayCircle, label: 'En Proceso' };
      case 'resolved': return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Resuelto' };
      case 'cancelled': return { color: 'bg-gray-100 text-gray-500', icon: XCircle, label: 'Cancelado' };
      default: return { color: 'bg-gray-100', icon: Clock, label: status };
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mantenimiento</h1>
          <p className="text-gray-500">Gestiona las incidencias de tus propiedades.</p>
        </div>
        <Link 
          to="/dashboard/tickets/new" 
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Reporte
        </Link>
      </div>

      {/* TABS DE FILTRO */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'pending', label: 'Pendientes' },
          { id: 'in_progress', label: 'En Proceso' },
          { id: 'resolved', label: 'Resueltos' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              filter === tab.id 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LISTA DE TICKETS */}
      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No hay tickets aquí</h3>
            <p className="text-gray-500">Todo parece estar funcionando correctamente.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={ticket.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row justify-between gap-4">
                
                {/* INFO IZQUIERDA */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${statusConfig.color} flex-shrink-0`}>
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{ticket.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{ticket.description}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      {ticket.priority && (
                        <span className={`px-2 py-1 rounded font-bold uppercase ${
                          ticket.priority === 'emergency' ? 'bg-red-100 text-red-600' : 
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {ticket.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACCIONES DERECHA (SOLO LANDLORD) */}
                <div className="flex flex-col items-end justify-center gap-2 min-w-[140px]">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusConfig.color}`}>
                    {statusConfig.label}
                  </div>

                  {/* CONTROLES DE ESTADO */}
                  {role === 'landlord' && ticket.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 mt-2">
                      {updatingId === ticket.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      ) : (
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 hover:bg-white cursor-pointer focus:ring-2 focus:ring-primary outline-none transition"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in_progress">En Proceso</option>
                          <option value="resolved">Resuelto</option>
                          <option value="cancelled">Cancelar</option>
                        </select>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}