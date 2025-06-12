import React from 'react';
import styles from './input.module.scss';

interface InputProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel';
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  inline?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  inline = false,
  className = ''
}) => {
  const formGroupClass = `${styles.formGroup} ${inline ? styles.inline : ''} ${className}`;

  return (
    <div className={formGroupClass}>
      <label htmlFor={id}>
        {label}
        {required && <span style={{ color: 'red' }}>*</span>}:
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default Input; 