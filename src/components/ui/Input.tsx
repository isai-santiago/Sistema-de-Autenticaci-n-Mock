import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    required?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    required,
    className = '',
    ...props
}) => {
    const inputId = React.useId();

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={inputId}
                className={`block text-sm font-semibold ${
                    error ? 'text-red-600' : 'text-gray-700'
                }`}
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <input
                id={inputId}
                className={`
                    block w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:bg-white
                    ${error
                        ? 'border-red-300 bg-red-50 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 border'
                    }
                    ${className}
                `}
                aria-invalid={error ? 'true' : 'false'}
                {...props}
            />

            {error && (
                <p className="text-sm text-red-500 font-medium animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};