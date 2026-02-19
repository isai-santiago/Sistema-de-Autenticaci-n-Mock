import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 5) score += 1; // Mínimo 6 caracteres
    if (pass.length > 8) score += 1; // Más larga
    if (/[A-Z]/.test(pass)) score += 1; // Tiene mayúscula
    if (/[0-9]/.test(pass)) score += 1; // Tiene número
    if (/[^A-Za-z0-9]/.test(pass)) score += 1; // Tiene símbolo especial
    return score;
  };

  const strength = calculateStrength(password);
  
  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength >= 4) return 'bg-green-500';
    return '';
  };

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Débil';
    if (strength === 3) return 'Buena';
    if (strength >= 4) return 'Fuerte';
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Seguridad de la contraseña:</span>
        <span className={`text-xs font-semibold ${getStrengthColor().replace('bg-', 'text-')}`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 transition-all duration-300 ${
              strength >= level ? getStrengthColor() : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};