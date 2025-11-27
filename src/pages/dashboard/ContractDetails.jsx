import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPaymentsByContract, registerPayment, createPaymentObligation } from '../../services/paymentService';
import { ArrowLeft, Plus, CheckCircle, Clock, DollarSign, Loader2 } from 'lucide-react';

export default function ContractDetails() {
  const { id } = useParams(); // Contract ID
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // Para saber qué pago se está procesando

  // Función para cargar pagos
  // Usamos useCallback para que la función sea estable y no cambie en cada render,
  // permitiendo usarla seguramente en el useEffect
  const loadPayments = useCallback(async () => {
    try {
      const data = await getPaymentsByContract(id);
      // Ordenar por fecha de vencimiento
      setPayments(data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
    } catch (error) {
      console.error("Error cargando pagos:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]); // Ahora loadPayments es una dependencia válida

  // Función 1: Generar Deuda (Simulación de "Cobrar mes")
  const handleGenerateDebt = async () => {
    const amount = prompt("Monto a cobrar:", "350.00");
    const date = prompt("Fecha límite (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
    
    if (amount && date) {
      setLoading(true);
      try {
        await createPaymentObligation({
          contract_id: id,
          amount: parseFloat(amount),
          due_date: date,
          status: "pending"
        });
        await loadPayments(); // Recargar lista
      } catch (error) {
        console.error("Error generando deuda:", error); // Usamos el error para loguearlo al menos
        alert("Error al generar deuda");
      } finally {
        setLoading(false);
      }
    }
  };

  // Función 2: Registrar Pago (Pagar una deuda existente)
  const handlePay = async (paymentId) => {
    if (!confirm("¿Confirmar que se recibió este pago?")) return;
    
    setProcessingId(paymentId);
    try {
      await registerPayment(paymentId, {
        status: "paid",
        payment_date: new Date().toISOString().split('T')[0],
        transaction_id: "MANUAL-" + Date.now() // Simulado por ahora
      });
      await loadPayments();
    } catch (error) {
      console.error("Error registrando pago:", error); // Usamos el error para loguearlo
      alert("Error al registrar pago");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && payments.length === 0) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
        </div>
        
        <button 
            onClick={handleGenerateDebt}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition flex items-center gap-2"
        >
            <Plus className="w-4 h-4" /> Generar Cobro
        </button>
      </div>

      {/* Lista de Pagos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {payments.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No hay registros de pagos para este contrato.</div>
        ) : (
            <div className="divide-y divide-gray-100">
                {payments.map((payment) => (
                    <div key={payment.id} className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition">
                        
                        {/* Info Izquierda */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={`p-3 rounded-full ${payment.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-lg">${payment.amount}</p>
                                <p className="text-sm text-gray-500">Vence: {payment.due_date}</p>
                            </div>
                        </div>

                        {/* Estado y Acción */}
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            {payment.status === 'paid' ? (
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" /> PAGADO
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1">El {payment.payment_date}</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <Clock className="w-3 h-3 mr-1" /> PENDIENTE
                                    </span>
                                    <button 
                                        onClick={() => handlePay(payment.id)}
                                        disabled={processingId === payment.id}
                                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition disabled:opacity-50"
                                    >
                                        {processingId === payment.id ? "Procesando..." : "Registrar Pago"}
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}