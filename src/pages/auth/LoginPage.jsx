import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../../services/authService';
import { Building2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  // 1. Inicializamos los hooks
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate(); // Hook para movernos entre páginas

  // 2. Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      // Llamamos al servicio de login
      await login(data.email, data.password);
      
      // Si no hay error, redirigimos inmediatamente al Dashboard
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error(error);
      // Mostramos un mensaje de error amigable si falla
      setErrorMsg('Credenciales incorrectas o error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Renderizado de la interfaz (JSX)
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-50 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido a Zerium</h1>
          <p className="text-gray-500 text-sm">Ingresa a tu panel de gestión</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              {...register("email", { 
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo inválida"
                }
              })}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="admin@zerium.ec"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Campo Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              {...register("password", { required: "La contraseña es obligatoria" })}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Mensaje de Error General */}
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}