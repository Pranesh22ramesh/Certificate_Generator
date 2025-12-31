import React from 'react';
import { getStatusColor } from '../utils/helpers';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  status,
  className = '',
  icon,
  onClick,
  ...props 
}) => {
  const baseClasses = 'badge';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  // If status is provided, use status-based styling
  const statusClasses = status ? getStatusColor(status) : '';
  
  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${status ? statusClasses : variantClasses[variant]}
    ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
    ${className}
  `.trim();

  const BadgeComponent = onClick ? 'button' : 'span';

  return (
    <BadgeComponent
      className={classes}
      onClick={onClick}
      {...props}
    >
      {icon && <span className={children ? 'mr-1' : ''}>{icon}</span>}
      {children}
    </BadgeComponent>
  );
};

export default Badge;