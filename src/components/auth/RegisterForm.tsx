'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { validateRegisterForm } from '@/lib/validation';
import { FormField } from '../forms/FormField';
import { Button } from '../ui/Button';
import { PasswordStrength } from './PasswordStrenght';
import Link from 'next/link'; // Importante para el enlace inferior

export const RegisterForm = () => {
  const { register } = useAuth();

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormValidation({
    initialValues: { name: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
    validationSchema: validateRegisterForm,
    onSubmit: async (data) => {
      await register(data);
    }
  });

  return (
    /* 1. Fondo de pantalla que respeta el modo oscuro del sistema */
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* 2. LA TARJETA: Forzamos bg-white. Si quieres que TAMBIÉN sea oscura, usa dark:bg-slate-900 */}
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 transition-all">
        
        <div className="text-center">
          {/* 3. TÍTULO: text-slate-900 (Negro) y dark:text-white */}
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Crear Cuenta</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Únete y empieza a gestionar tus usuarios</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          {/* NOTA: Para que los labels de FormField sean negros, 
              debes asegurarte que dentro de FormField.tsx el <label> 
              tenga la clase text-slate-900 o text-black.
          */}
          <FormField
            label="Nombre Completo"
            name="name"
            value={values.name}
            onChange={(val) => handleChange('name', val)}
            onBlur={() => handleBlur('name')}
            error={errors.name}
            placeholder="Ej. Juan Pérez"
          />

          <FormField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={values.email}
            onChange={(val) => handleChange('email', val)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            placeholder="correo@ejemplo.com"
          />

          <div className="space-y-1">
            <FormField
              label="Contraseña"
              name="password"
              type="password"
              value={values.password}
              onChange={(val) => handleChange('password', val)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              placeholder="••••••••"
            />
            <PasswordStrength password={values.password} />
          </div>

          <FormField
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={(val) => handleChange('confirmPassword', val)}
            onBlur={() => handleBlur('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="••••••••"
          />

          {/* Checkbox de Términos: Forzamos texto negro/gris oscuro */}
          <div className="flex items-start bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={values.acceptTerms}
                onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="text-slate-800 dark:text-slate-200 cursor-pointer font-medium">
                Acepto los términos y condiciones
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs mt-1 font-semibold">{errors.acceptTerms}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" isLoading={isSubmitting} className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all font-semibold">
              Registrarse ahora
            </Button>
          </div>
        </form>

        {/* Enlace inferior corregido para visibilidad */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Inicia Sesión
            </Link>
        </p>
      </div>
    </div>
  );
};