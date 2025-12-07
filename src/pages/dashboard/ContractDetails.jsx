import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, User, Calendar, DollarSign, 
  ArrowLeft, Building2, Download, Plus, 
  History, CheckCircle, AlertCircle 
} from 'lucide-react';
import { getContractById } from '../../services/contractService';
import { getContractPayments } from '../../services/paymentService'; // <--- Nuevo Servicio
import { getCurrentRole } from '../../services/authService';
import PaymentModal from '../../components/modals/PaymentModal'; // <--- Importamos el Modal

export default function ContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = getCurrentRole();
  
  const [contract, setContract] = useState(null);
  const [payments, setPayments] = useState([]); // Estado para los pagos
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Control del Modal

  // Función para cargar (o recargar) datos
  async function loadData() {
    try {
      // 1. Cargar Contrato
      const contractData = await getContractById(id);
      setContract(contractData);

      // 2. Cargar Pagos
      const paymentsData = await getContractPayments(id);
      setPayments(paymentsData);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Cargando contrato...</div>;
  if (!contract) return <div className="p-10 text-center">Contrato no encontrado</div>;

  // Cálculos visuales
  const isDebt = contract.balance > 0;
  const statusColor = contract.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* --- HEADER Y NAVEGACIÓN --- */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </button>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColor}`}>
          {contract.is_active ? 'Activo' : 'Inactivo'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- COLUMNA IZQUIERDA: DETALLES DEL CONTRATO --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="text-primary" /> Contrato de Arrendamiento
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unidad */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Building2 className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm text-gray-500">Unidad Alquilada</p>
                  <p className="font-medium text-gray-900">
                    {contract.unit?.unit_number || "Unidad"} 
                    <span className="text-gray-400 text-sm ml-1">(ID: {contract.unit_id.slice(0,6)})</span>
                  </p>
                </div>
              </div>

              {/* Inquilino */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><User className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm text-gray-500">Inquilino</p>
                  <p className="font-medium text-gray-900">
                    {contract.tenant?.full_name || "Nombre no disponible"}
                  </p>
                  <p className="text-xs text-gray-400">{contract.tenant?.email}</p>
                </div>
              </div>

              {/* Fechas */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Calendar className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="font-medium text-gray-900">
                    {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Día de Pago */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm text-gray-500">Día de Pago</p>
                  <p className="font-medium text-gray-900">Los días {contract.payment_day} de cada mes</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- TABLA DE HISTORIAL DE PAGOS --- */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" /> Historial de Pagos
              </h3>
            </div>
            
            {payments.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">No hay pagos registrados aún.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="px-6 py-3">Fecha</th>
                      <th className="px-6 py-3">Método</th>
                      <th className="px-6 py-3">Nota</th>
                      <th className="px-6 py-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-gray-900">{new Date(pay.payment_date).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-gray-600">{pay.payment_method}</td>
                        <td className="px-6 py-3 text-gray-500 italic truncate max-w-xs">{pay.notes || "-"}</td>
                        <td className="px-6 py-3 text-right font-bold text-green-600">
                          +${Number(pay.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* --- COLUMNA DERECHA: TARJETA FINANCIERA --- */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-24 h-24 text-primary" />
            </div>

            <h3 className="text-gray-500 font-medium mb-1">Estado Financiero</h3>
            
            {/* Balance Gigante */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-1">Saldo Pendiente</p>
              <div className={`text-4xl font-extrabold ${isDebt ? 'text-red-500' : 'text-green-500'} flex items-center`}>
                ${Number(contract.balance).toFixed(2)}
                {isDebt && <AlertCircle className="w-6 h-6 ml-2 text-red-400 animate-pulse" />}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Canon Mensual</span>
                <span className="font-bold text-gray-900">${contract.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pagos Registrados</span>
                <span className="font-bold text-green-600">{payments.length}</span>
              </div>
            </div>

            {/* BOTÓN REGISTRAR PAGO (SOLO LANDLORD) */}
            {role === 'landlord' && (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Registrar Pago
              </button>
            )}

            {/* Botón Descargar (Visual) */}
            <button className="w-full mt-3 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Descargar Contrato
            </button>

          </div>
        </div>
      </div>

      {/* --- RENDERIZADO DEL MODAL --- */}
      {showPaymentModal && (
        <PaymentModal 
          contractId={contract.id}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={loadData} // Cuando guarde, recarga todo
        />
      )}

    </div>
  );
}