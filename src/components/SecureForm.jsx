import { forwardRef } from 'react';
import { useSecureForm } from '../hooks/useCSRF';

/**
 * Secure form component that automatically handles CSRF protection
 */
const SecureForm = forwardRef(({ 
  onSubmit, 
  children, 
  className = '',
  showCSRFError = true,
  ...props 
}, ref) => {
  const { handleSubmit, isSubmitting, csrfError, clearError } = useSecureForm(onSubmit);

  const onFormSubmit = async (event) => {
    event.preventDefault();
    
    // Clear any previous CSRF errors
    if (csrfError) {
      clearError();
    }

    // Get form data
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    // Call secure submit handler
    await handleSubmit(formObject, event);
  };

  return (
    <form 
      ref={ref}
      onSubmit={onFormSubmit}
      className={className}
      {...props}
    >
      {/* CSRF Error Display */}
      {showCSRFError && csrfError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{csrfError}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                type="button"
                onClick={clearError}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
      
      {/* Optional: Add visual feedback when submitting */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </form>
  );
});

SecureForm.displayName = 'SecureForm';

export default SecureForm;
