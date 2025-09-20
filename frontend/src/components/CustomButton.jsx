const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    loading = false, 
    onClick, 
    className = '',
    type = 'button',
    ...props 
  }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      primary: `bg-[${theme.colors.primary}] hover:bg-[${theme.colors.primaryHover}] text-white focus:ring-[${theme.colors.primary}]`,
      secondary: `bg-[${theme.colors.secondary}] hover:bg-gray-200 text-[${theme.colors.text.primary}] focus:ring-gray-300`,
      outline: `border border-[${theme.colors.border}] hover:bg-[${theme.colors.secondary}] text-[${theme.colors.text.primary}] focus:ring-[${theme.colors.primary}]`,
    };
    
    const sizes = {
      small: 'px-3 py-2 text-sm',
      medium: 'px-4 py-2.5 text-sm',
      large: 'px-6 py-3 text-base',
    };
    
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
        style={{ fontFamily: theme.fonts.primary }}
        {...props}
      >
        {loading && (
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  };