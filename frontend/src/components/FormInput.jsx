const FormInput = ({ 
    label, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    error, 
    required = false,
    disabled = false,
    icon: Icon,
    className = '',
    ...props 
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label 
            className="block text-sm font-medium text-gray-700"
            style={{ fontFamily: theme.fonts.primary }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full rounded-lg border transition-colors duration-200
              ${Icon ? 'pl-10' : 'pl-4'} 
              ${isPassword ? 'pr-10' : 'pr-4'}
              py-2.5 text-sm
              ${error 
                ? `border-red-300 focus:border-red-500 focus:ring-red-500` 
                : `border-gray-300 focus:border-[${theme.colors.borderFocus}] focus:ring-[${theme.colors.borderFocus}]`
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-20
              disabled:bg-gray-50 disabled:cursor-not-allowed
            `}
            style={{ fontFamily: theme.fonts.primary }}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600" style={{ fontFamily: theme.fonts.primary }}>
            {error}
          </p>
        )}
      </div>
    );
  };  