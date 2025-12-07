import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom'; // <--- Importar Link
import { Building2, Mail, Lock, Loader2 } from 'lucide-react';
import { login } from '../../services/authService';
import { useState } from 'react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setLoginError('Credenciales incorrectas. Intenta nuevamente.');
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
          <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a Zerium</h2>
          <p className="text-blue-100">Gestión inmobiliaria inteligente</p>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {loginError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {loginError}
              </div>
            )}

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
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                  className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary border p-2.5"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Iniciar Sesión'}
            </button>
          </form>

          {/* --- ENLACE DE REGISTRO (NUEVO) --- */}
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600">
              ¿Aún no tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-blue-500 hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}