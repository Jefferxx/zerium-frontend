import { useForm } from 'react-hook-form';
import { X, DollarSign, CreditCard, FileText, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { createPayment } from '../../services/paymentService';

export default function PaymentModal({ contractId, onClose, onPaymentSuccess }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            // Preparamos el objeto para el backend
            const payload = {
                contract_id: contractId,
                amount: parseFloat(data.amount),
                payment_method: data.payment_method,
                notes: data.notes
            };

            await createPayment(payload);

            onPaymentSuccess(); // Recargamos los datos de la página de atrás
            onClose();          // Cerramos el modal
        } catch (error) {
            console.error(error);
            setErrorMsg('Error al registrar el pago. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-fade-in">

                {/* Botón Cerrar */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                    <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Registrar Pago</h2>
                        <p className="text-sm text-gray-500">Ingresa los detalles del abono</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {errorMsg && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {errorMsg}
                        </div>
                    )}

                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                {...register("amount", { required: "El monto es obligatorio", min: { value: 0.01, message: "Debe ser mayor a 0" } })}
                                className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="0.00"
                            />
                        </div>
                        {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
                    </div>

                    {/* Método de Pago */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                            </div>
                            <select
                                {...register("payment_method", { required: true })}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary appearance-none bg-white"
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia Bancaria</option>
                                <option value="Depósito">Depósito</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas (Opcional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none">
                                <FileText className="w-4 h-4 text-gray-400" />
                            </div>
                            <textarea
                                {...register("notes")}
                                rows="3"
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="Ej: Pago correspondiente a Marzo..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm transition"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            Guardar Pago
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}