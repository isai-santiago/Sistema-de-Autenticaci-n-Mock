'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { validateRegisterForm } from '@/lib/validation';
import { RegisterData } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function RegisterPage() {
  const { register, error: authError } = useAuth();
  const router = useRouter();
  
  // ESTADO BONUS: Controla si mostramos el formulario o el mensaje de éxito
  const [isSuccess, setIsSuccess] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = 
    useFormValidation<RegisterData>({
      initialValues: { name: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
      validationSchema: validateRegisterForm,
      onSubmit: async (data) => {
        await register(data);
        // BONUS: En lugar de ir al dashboard, mostramos la pantalla de verificación
        setIsSuccess(true);
      }
    });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        
        {isSuccess ? (
          /* PANTALLA BONUS: Verificación de Email */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <h2 className="text-2xl font-bold text-black mb-2">¡Revisa tu correo!</h2>
            <p className="text-gray-600 mb-6 font-medium">Hemos enviado un enlace de verificación a <b>{values.email}</b>. Por favor, confirma tu cuenta para continuar.</p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Ir a Iniciar Sesión
            </Button>
          </div>
        ) : (
          /* FORMULARIO NORMAL */
          <>
            <h2 className="text-3xl font-bold text-center mb-6 text-black">Crear Cuenta</h2>
            
            {authError && <Alert message={authError} type="error" />}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nombre Completo" name="name" value={values.name} onChange={(e) => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')} error={touched.name && errors.name ? errors.name : undefined} />
              <Input label="Email" name="email" type="email" value={values.email} onChange={(e) => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} error={touched.email && errors.email ? errors.email : undefined} />
              <Input label="Contraseña" name="password" type="password" value={values.password} onChange={(e) => handleChange('password', e.target.value)} onBlur={() => handleBlur('password')} error={touched.password && errors.password ? errors.password : undefined} />
              <Input label="Confirmar Contraseña" name="confirmPassword" type="password" value={values.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} onBlur={() => handleBlur('confirmPassword')} error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined} />

              <div className="flex items-center gap-2">
                <input type="checkbox" id="terms" checked={values.acceptTerms} onChange={(e) => handleChange('acceptTerms', e.target.checked)} />
                <label htmlFor="terms" className="text-sm text-black font-medium">Acepto los términos</label>
              </div>
              {touched.acceptTerms && errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}

              <Button type="submit" isLoading={isSubmitting} variant="primary">
                Registrarse
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-black font-medium">
               ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 font-bold hover:underline">Inicia Sesión</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}