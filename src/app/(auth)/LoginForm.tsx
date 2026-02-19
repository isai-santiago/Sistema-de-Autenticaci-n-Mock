import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateLoginForm } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { useState } from "react";

export const LoginForm = () => {
  const { login, error: authError } = useAuth();
  const [alertMessage, setAlertMessage] = useState<string>('');

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormValidation({
    // 1. Agregamos rememberMe a los valores iniciales
    initialValues: { email: '', password: '', rememberMe: false },
    validationSchema: validateLoginForm,
    onSubmit: async (data) => {
      await login(data);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {authError && <Alert message={authError} type="error" />}
      
      <FormField
        label="Correo Electrónico"
        name="email"
        type="email"
        value={values.email}
        onChange={(val) => handleChange('email', val)}
        onBlur={() => handleBlur('email')}
        error={errors.email}
      />

      <FormField
        label="Contraseña"
        name="password"
        type="password"
        value={values.password}
        onChange={(val) => handleChange('password', val)}
        onBlur={() => handleBlur('password')}
        error={errors.password}
      />

      {/* 2. Agregamos el Checkbox de Recordarme */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          checked={values.rememberMe}
          onChange={(e) => handleChange('rememberMe', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
          Recordarme en este equipo
        </label>
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Iniciar Sesión
      </Button>
    </form>
  );
};