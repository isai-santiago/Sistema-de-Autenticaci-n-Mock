import { useState, useCallback } from 'react';
import { ValidationErrors } from '@/lib/types';

interface UseFormValidationOptions<T> {
    initialValues: T;
    validationSchema: (values: T) => ValidationErrors;
    onSubmit: (values: T) => Promise<void> | void;
}

export function useFormValidation<T>({
    initialValues,
    validationSchema,
    onSubmit
}: UseFormValidationOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = useCallback((name: string, value: any) => {
        const fieldErrors = validationSchema({ ...values, [name]: value });
        setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
    }, [values, validationSchema]);

    const handleChange = useCallback((name: string, value: any) => {
        setValues(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            validateField(name, value);
        }
    }, [touched, validateField]);

    const handleBlur = useCallback((name: string) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, values[name as keyof T]);
    }, [values, validateField]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        const allTouched = Object.keys(values as object).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );
        setTouched(allTouched);

        const validationErrors = validationSchema(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [values, validationSchema, onSubmit]);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm
    };
}