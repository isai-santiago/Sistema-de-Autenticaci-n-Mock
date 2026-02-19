import React from 'react';

interface FormValidationProps {
  errors: Record<string, string>;
}

export const FormValidation: React.FC<FormValidationProps> = ({ errors }) => {
  const errorList = Object.values(errors).filter(err => err !== '');
  
  if (errorList.length === 0) return null;

  return (
    <div className="bg-red-50 p-3 rounded-md mb-4 border border-red-200">
      <ul className="list-disc list-inside text-sm text-red-600">
        {errorList.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};