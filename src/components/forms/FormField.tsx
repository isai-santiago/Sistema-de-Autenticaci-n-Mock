import React from 'react';
import { Input } from '../ui/Input';


interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  onChange,
  ...props
}) => {
  return (
    <div className="mb-4">
      <Input
        label={label}
        error={error}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};