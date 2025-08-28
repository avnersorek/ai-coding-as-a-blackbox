import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormState, LoginCredentials } from '@ai-coding/shared-types';
import { validateLoginCredentials, AuthService } from '@ai-coding/core-logic';

function Login() {
  const navigate = useNavigate();
  const authService = new AuthService();
  
  const [formState, setFormState] = useState<LoginFormState>({
    credentials: { email: '', password: '' },
    errors: {},
    isSubmitting: false
  });

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [field]: e.target.value
      },
      errors: {
        ...prev.errors,
        [field]: undefined // Clear field-specific error when user types
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormState(prev => ({ ...prev, errors: {}, isSubmitting: true }));
    
    // Validate form
    const validationErrors = validateLoginCredentials(formState.credentials);
    
    if (Object.keys(validationErrors).length > 0) {
      setFormState(prev => ({
        ...prev,
        errors: validationErrors,
        isSubmitting: false
      }));
      return;
    }
    
    try {
      // Attempt login
      const result = await authService.login(formState.credentials);
      
      if (result.success && result.user) {
        // Store user in sessionStorage for welcome page
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        
        // Navigate to welcome page
        navigate('/welcome');
      } else {
        setFormState(prev => ({
          ...prev,
          errors: { general: result.error || 'Login failed' },
          isSubmitting: false
        }));
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        errors: { general: 'An unexpected error occurred' },
        isSubmitting: false
      }));
    }
  };

  return (
    <div className="container">
      <div className="logo"></div>
      <div className="login-form">
        <h2>Sign-in</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="name@example.com"
              value={formState.credentials.email}
              onChange={handleInputChange('email')}
            />
            {formState.errors.email && (
              <div className="error-message email-error">{formState.errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formState.credentials.password}
              onChange={handleInputChange('password')}
            />
            {formState.errors.password && (
              <div className="error-message password-error">{formState.errors.password}</div>
            )}
          </div>
          {formState.errors.general && (
            <div className="error-message credentials-error">{formState.errors.general}</div>
          )}
          <div className="form-group">
            <button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Please wait...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;