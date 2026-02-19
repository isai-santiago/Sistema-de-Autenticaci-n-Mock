import { LoginCredentials, RegisterData, ValidationErrors } from './types';

// 1. La interfaz que corrige los errores de minLength y maxLength
interface ValidationRule {
    required?: boolean;
    pattern?: RegExp;
    message: string;
    minLength?: number;
    maxLength?: number;
}

export const validationRules: Record<string, ValidationRule> = {
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Ingresa un email válido'
    },
    password: {
        required: true,
        minLength: 6,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Password debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número'
    },
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
        message: 'Nombre debe tener entre 2-50 caracteres, solo letras y espacios'
    }
};

// 2. ¡Esta es la función que faltaba!
export const validateField = (name: string, value: string): string => {
    const rules = validationRules[name];

    if (!rules) return '';

    if (rules.required && !value.trim()) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} es requerido`;
    }

    if (rules.minLength && value.length < rules.minLength) {
        return `Mínimo ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        return `Máximo ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message;
    }

    return '';
};

export const validateLoginForm = (data: LoginCredentials): ValidationErrors => {
    const errors: ValidationErrors = {};

    const emailError = validateField('email', data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validateField('password', data.password);
    if (passwordError) errors.password = passwordError;

    return errors;
};

export const validateRegisterForm = (data: RegisterData): ValidationErrors => {
    const errors: ValidationErrors = {};

    const nameError = validateField('name', data.name);
    if (nameError) errors.name = nameError;

    const emailError = validateField('email', data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validateField('password', data.password);
    if (passwordError) errors.password = passwordError;

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!data.acceptTerms) {
        errors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    return errors;
};