import React from 'react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning';
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type = 'error', message }) => {
  const styles = {
    error: "bg-red-50 border-red-500 text-red-700",
    success: "bg-green-50 border-green-500 text-green-700",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-700"
  };

  if (!message) return null;

  return (
    <div className={`border-l-4 p-4 mb-4 ${styles[type]} rounded-r`}>
      <p className="font-medium">{message}</p>
    </div>
  );
};