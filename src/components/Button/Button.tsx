import React from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface IButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<IButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    rounded ? styles.rounded : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};