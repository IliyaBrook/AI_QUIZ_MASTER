import React from 'react';
import styles from './select.module.scss';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  inline?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  id,
  value,
  options,
  onChange,
  disabled = false,
  placeholder,
  inline = false,
  className = '',
}) => {
  const formGroupClass = `${styles.formGroup} ${inline ? styles.inline : ''} ${className}`;

  return (
    <div className={formGroupClass}>
      <label htmlFor={id}>{label}:</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {placeholder && (
          <option value='' disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
