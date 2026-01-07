import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, Calendar, CreditCard, FileText, CheckCircle, Loader2, AlertTriangle, Wallet } from 'lucide-react';
import { getMyPaymentsHistory, createPayment } from '../../services/paymentService';
import { getMyContracts } from '../../services/contractService';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de tener este hook, o usa localStorage para ver el rol

export default function PaymentsPage() {
    const { user } = useAuth(); // Necesitamos saber si es tenant o landlord
    const [payments, setPayments] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Formulario para nuevos pagos
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    // Cargar datos iniciales
    useEffect(() => {
        async function loadData() {
            try {
                const [paymentsData, contractsData] = await Promise.all([
                    getMyPaymentsHistory(),
                    getMyContracts()
                ]);
                setPayments(paymentsData);
                setContracts(contractsData);
            } catch (error) {
                console.error("Error cargando pagos:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Manejar envío del formulario (Solo Inquilinos)
    const onSubmitPayment = async (data) => {
        setSubmitting(true);
        try {
            await createPayment({
                contract_id: data.contract_id,
                amount: parseFloat(data.amount),
                payment_method: data.payment_method,
                notes: data.notes
            });
            
            // Recargar lista y limpiar form
            const updatedPayments = await getMyPaymentsHistory();
            setPayments(updatedPayments);
            reset();
            alert("¡Pago registrado correctamente!");
        } catch (error) {
            console.error("Error registrando pago:", error);
            alert("Hubo un error al registrar el pago.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

    const isTenant = user?.role === 'tenant';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Encabezado */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión Financiera</h1>
                <p className="text-gray-500 mt-1">
                    {isTenant ? "Registra tus pagos y consulta tu historial." : "Supervisa los ingresos de tus propiedades."}
                </p>
            </div>

            {/* SECCIÓN DE REGISTRO (SOLO PARA INQUILINOS) */}
            {isTenant && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary" /> Registrar Nuevo Pago
                    </h2>
                    
                    {contracts.length === 0 ? (
                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            No tienes contratos activos para realizar pagos.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmitPayment)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Selección de Contrato */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contrato a Pagar</label>
                                <select 
                                    {...register("contract_id", { required: "Selecciona un contrato" })}
                                    className="w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary p-2.5 border"
                                >
                                    {contracts.map(c => (
                                        <option key={c.id} value={c.id}>
                                            Contrato #{c.id.slice(0,8)} - {c.unit?.unit_number || "Unidad"} (Deuda: ${c.balance ?? c.amount})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Monto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("amount", { required: true, min: 1 })}
                                        className="pl-9 w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary p-2.5 border"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Método */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                                <select 
                                    {...register("payment_method", { required: true })}
                                    className="w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary p-2.5 border"
                                >
                                    <option value="Transferencia">Transferencia Bancaria</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Depósito">Depósito</option>
                                </select>
                            </div>

                            {/* Notas */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Referencia</label>
                                <input
                                    type="text"
                                    {...register("notes")}
                                    className="w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary p-2.5 border"
                                    placeholder="Ej: Transferencia Banco Pichincha #123456"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="col-span-1 md:col-span-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                Registrar Pago
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* TABLA DE HISTORIAL */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Historial de Transacciones</h2>
                </div>
                
                {payments.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No hay pagos registrados aún.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Método</th>
                                    <th className="px-6 py-4">Notas</th>
                                    <th className="px-6 py-4 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 flex items-center gap-2 text-gray-700">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(p.payment_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                <CreditCard className="w-3 h-3" /> {p.payment_method}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {p.notes || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                                            ${parseFloat(p.amount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}