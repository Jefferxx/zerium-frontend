import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Mail, Lock, Phone, Briefcase, Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { registerUser } from '../../services/authService';
import { useState } from 'react';

export default function RegisterPage() {
  // mode: 'onChange' valida mientras escribes, dando feedback inmediato
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onChange' });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Observamos la contraseña para calcular fuerza
  const passwordValue = watch("password", "");

  // Función para calcular fuerza (0 a 4)
  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = calculateStrength(passwordValue);

  const getStrengthColor = () => {
    if (strengthScore <= 2) return "bg-red-500";
    if (strengthScore === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strengthScore <= 2) return "Débil";
    if (strengthScore === 3) return "Buena";
    return "Fuerte";
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      // 1. Preparamos los datos (quitamos confirmPassword)
      const { confirmPassword, ...payload } = data;

      console.log("Enviando datos al backend:", payload); // Debug en consola

      // 2. Llamada al servicio
      await registerUser(payload);

      // 3. Éxito
      alert('¡Cuenta creada con éxito! Por favor inicia sesión.');
      navigate('/login');

    } catch (error) {
      console.error("Error detallado de registro:", error);

      // 4. MANEJO DE ERRORES INTELIGENTE
      if (error.response && error.response.data) {
        const detail = error.response.data.detail;

        if (Array.isArray(detail)) {
          // Si es un error de validación de Pydantic (lista de errores)
          // Tomamos el primer mensaje y lo mostramos
          const firstError = detail[0];
          setServerError(`Error en ${firstError.loc[1]}: ${firstError.msg}`);
        } else if (typeof detail === 'string') {
          // Si es un mensaje directo (ej: "Email already registered")
          setServerError(detail);
        } else {
          setServerError('Error desconocido en el servidor.');
        }
      } else if (error.request) {
        // El servidor no respondió (caído o sin internet)
        setServerError('No se pudo conectar con el servidor. Revisa tu internet.');
      } else {
        setServerError('Ocurrió un error inesperado. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="bg-primary p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Crear Cuenta</h2>
          <p className="text-blue-100 text-sm">Únete a Zerium hoy mismo</p>
        </div>

        {/* Formulario */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Mensaje de Error del Servidor */}
            {serverError && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-start gap-2">
                <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{serverError}</span>
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
                  {...register("full_name", {
                    required: "El nombre es obligatorio",
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: "Solo se permiten letras y espacios"
                    }
                  })}
                  className={`pl-10 block w-full border rounded-lg focus:ring-primary focus:border-primary p-2.5 ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
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
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Dirección de correo inválida"
                    }
                  })}
                  className={`pl-10 block w-full border rounded-lg focus:ring-primary focus:border-primary p-2.5 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="juan@ejemplo.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Móvil</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("phone_number", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^09\d{8}$/,
                      message: "Debe ser un celular válido de Ecuador (Empieza con 09)"
                    }
                  })}
                  maxLength={10}
                  className={`pl-10 block w-full border rounded-lg focus:ring-primary focus:border-primary p-2.5 ${errors.phone_number ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0991234567"
                />
              </div>
              {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number.message}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Crea una contraseña",
                    minLength: { value: 8, message: "Mínimo 8 caracteres" },
                    validate: (value) => calculateStrength(value) >= 3 || "La contraseña es muy débil"
                  })}
                  className={`pl-10 pr-10 block w-full border rounded-lg focus:ring-primary focus:border-primary p-2.5 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Barra de Fuerza */}
              {passwordValue && (
                <div className="mt-2 transition-all duration-300">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Fortaleza: <strong>{getStrengthLabel()}</strong></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${getStrengthColor()}`}
                      style={{ width: `${(strengthScore / 4) * 100}%` }}
                    ></div>
                  </div>
                  {strengthScore < 3 && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      Tip: Usa Mayúsculas, Números y Símbolos ($%#)
                    </p>
                  )}
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Check className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (value) => value === passwordValue || "Las contraseñas no coinciden"
                  })}
                  className={`pl-10 block w-full border rounded-lg focus:ring-primary focus:border-primary p-2.5 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            {/* Rol */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo usarás Zerium?</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input type="radio" value="landlord" {...register("role", { required: true })} className="peer sr-only" defaultChecked />
                  <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-blue-50 transition text-center group">
                    <Briefcase className="w-6 h-6 mx-auto mb-2 text-gray-500 peer-checked:text-primary group-hover:text-primary transition" />
                    <span className="text-sm font-medium text-gray-900">Soy Dueño</span>
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input type="radio" value="tenant" {...register("role", { required: true })} className="peer sr-only" />
                  <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-blue-50 transition text-center group">
                    <User className="w-6 h-6 mx-auto mb-2 text-gray-500 peer-checked:text-primary group-hover:text-primary transition" />
                    <span className="text-sm font-medium text-gray-900">Soy Inquilino</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 transform active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Registrando...
                </div>
              ) : 'Registrarme'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-blue-500 hover:underline transition">
                Inicia Sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}