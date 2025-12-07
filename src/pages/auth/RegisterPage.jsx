import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Mail, Lock, Phone, Briefcase, Loader2 } from 'lucide-react';
import { registerUser } from '../../services/authService';
import { useState } from 'react';

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');
        try {
            await registerUser(data);
            alert('¡Cuenta creada con éxito! Por favor inicia sesión.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            if (error.response?.status === 400) {
                setServerError('El correo electrónico ya está registrado.');
            } else {
                setServerError('Error al registrarse. Intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-primary p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
                    <p className="text-blue-100">Únete a Zerium hoy mismo</p>
                </div>

                {/* Formulario */}
                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Mensaje de Error */}
                        {serverError && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {serverError}
                            </div>
                        )}

                        {/* Nombre Completo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("full_name", { required: "El nombre es obligatorio" })}
                                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary border p-2.5"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    {...register("email", { required: "El correo es obligatorio" })}
                                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary border p-2.5"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("phone_number", { required: "El teléfono es obligatorio" })}
                                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary border p-2.5"
                                    placeholder="099..."
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    {...register("password", { required: "Crea una contraseña segura", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary border p-2.5"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">¿Cómo usarás Zerium?</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="cursor-pointer">
                                    <input type="radio" value="landlord" {...register("role", { required: true })} className="peer sr-only" defaultChecked />
                                    <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-blue-50 transition text-center">
                                        <Briefcase className="w-6 h-6 mx-auto mb-2 text-gray-500 peer-checked:text-primary" />
                                        <span className="text-sm font-medium text-gray-900">Soy Dueño</span>
                                    </div>
                                </label>

                                <label className="cursor-pointer">
                                    <input type="radio" value="tenant" {...register("role", { required: true })} className="peer sr-only" />
                                    <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-blue-50 transition text-center">
                                        <User className="w-6 h-6 mx-auto mb-2 text-gray-500 peer-checked:text-primary" />
                                        <span className="text-sm font-medium text-gray-900">Soy Inquilino</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 mt-6"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Registrarme'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-blue-500 hover:underline">
                                Inicia Sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}