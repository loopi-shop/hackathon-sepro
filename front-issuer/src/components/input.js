import { forwardRef } from 'react';

/**
 * Input component
 * @param {Object} props - Props
 * @param {string} props.label - label
 * @param {string} props.id - ID
 * @param {string} [props.size] - Size ('small', 'large') (optional)
 * @param {string} [props.error] - Error (optional)
 * @param {string} [props.className] - Class name (optional)
 * @param {string} [props.iconClass] - Class for the icon (optional)
 * @param {string} [props.placeholder] - Placeholder text (optional)
 * @param {React.CSSProperties} [props.containerStyle] - The container style (optional)
 * * @param {React.CSSProperties} [props.style] - Style (optional)
 * @returns {React.Component} An input component
 */
export const Input = forwardRef(
  (
    {
      label,
      id,
      size,
      error,
      className,
      iconClass,
      placeholder,
      containerStyle,
      style,
      ...otherProps
    },
    ref
  ) => {
    return (
      <div className={className} style={containerStyle}>
        <div className={`br-input ${size ? size : ''}`}>
          <label htmlFor={id}>{label}</label>
          <div className="input-group">
            {iconClass && (
              <div className="input-icon">
                <i className={iconClass} aria-hidden="true"></i>
              </div>
            )}
            <input
              ref={ref}
              className={size ? size : ''}
              id={id}
              type="text"
              placeholder={placeholder}
              style={style}
              {...otherProps}
            />
            {error && (
              <span className="feedback danger" role="alert">
                <i class="fas fa-times-circle" aria-hidden="true"></i>
                {error}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);
