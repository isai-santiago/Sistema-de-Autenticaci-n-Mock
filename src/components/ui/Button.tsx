import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  // Base más moderna con transiciones suaves
  const baseStyles = "relative w-full py-2.5 px-4 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] flex justify-center items-center shadow-sm";
  
  const variants = {
    primary: "border border-transparent text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md focus:ring-blue-500",
    secondary: "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200",
    danger: "border border-transparent text-white bg-red-500 hover:bg-red-600 hover:shadow-md focus:ring-red-500"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-80 cursor-wait' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </span>
      ) : children}
    </button>
  );
};