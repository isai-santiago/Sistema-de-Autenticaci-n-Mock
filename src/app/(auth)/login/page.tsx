'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { validateLoginForm } from '@/lib/validation';
import { LoginCredentials } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function LoginPage() {
  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [code2fa, setCode2fa] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [tempData, setTempData] = useState<LoginCredentials | null>(null);

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
    clearError();
  }, [isAuthenticated, router, clearError]);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = 
    useFormValidation<LoginCredentials>({
      initialValues: { email: '', password: '' },
      validationSchema: validateLoginForm,
      onSubmit: async (data) => {
        try {
          // Intentamos hacer login con las credenciales
          const result = await login({ ...data, rememberMe });
          
          // Si la respuesta indica que necesita 2FA, cambiamos la pantalla
          if (result?.requires2FA) {
            setTempData(data);
            setStep('2fa');
          }
        } catch (error) {
           // El error de contraseña incorrecta lo maneja el AuthContext
        }
      }
    });

  const handle2FA = async () => {
    if (tempData) {
      try {
        await login({ ...tempData, rememberMe }, code2fa);
      } catch (error) {
         // El error de código inválido se mostrará en el <Alert>
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        
        {authError && <Alert message={authError} type="error" />}

        {step === '2fa' ? (
          <div className="text-center mt-4">
            <h2 className="text-3xl font-bold text-black mb-4">Seguridad 2FA</h2>
            <p className="text-sm text-gray-600 mb-6 font-medium">Ingresa el código de 6 dígitos de tu aplicación autenticadora. (Usa: 123456)</p>
            <Input 
              label="Código de Autenticación" 
              name="code2fa"
              value={code2fa} 
              onChange={(e) => setCode2fa(e.target.value)} 
              placeholder="123456" 
            />
            <Button className="w-full mt-6" onClick={handle2FA}>
              Verificar y Entrar
            </Button>
            <button onClick={() => setStep('login')} className="mt-4 text-sm text-blue-600 font-bold hover:underline">
              Volver al Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-6 text-black">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Email" name="email" type="email" value={values.email} onChange={(e) => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} error={touched.email && errors.email ? errors.email : undefined} />
              <Input label="Contraseña" name="password" type="password" value={values.password} onChange={(e) => handleChange('password', e.target.value)} onBlur={() => handleBlur('password')} error={touched.password && errors.password ? errors.password : undefined} />

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <label htmlFor="remember" className="text-sm text-black font-medium">Recuérdame en este equipo</label>
              </div>

              <Button type="submit" isLoading={isSubmitting}>Entrar</Button>
            </form>
            
            <p className="mt-6 text-center text-sm text-black font-medium">
               ¿No tienes cuenta? <Link href="/register" className="text-blue-600 font-bold hover:underline">Regístrate</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}