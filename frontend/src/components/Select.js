import React from 'react';

const Select = ({
  name,
  id,
  label,
  value,
  options = [],
  disabled = false,
  required = false,
  error,
  helperText,
  placeholder = 'Select an option...',
  className = '',
  containerClassName = '',
  labelClassName = '',
  onChange,
  onBlur,
  onFocus,
  ...props
}) => {
  const baseSelectClasses = 'input-field';
  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  
  const selectClasses = `
    ${baseSelectClasses}
    ${errorClasses}
    ${className}
  `.trim();

  const selectId = id || name;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        className={selectClasses}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => {
          // Handle different option formats
          if (typeof option === 'string') {
            return (
              <option key={index} value={option}>
                {option}
              </option>
            );
          } else if (typeof option === 'object' && option.value !== undefined) {
            return (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label || option.value}
              </option>
            );
          }
          return null;
        })}
      </select>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;