// Validation Logic
export function validateLoginCredentials(credentials) {
    const errors = {};
    // Email validation
    if (!credentials.email.trim()) {
        errors.email = 'Email is required';
    }
    else if (!isValidEmail(credentials.email)) {
        errors.email = 'Invalid email format';
    }
    // Password validation
    if (!credentials.password.trim()) {
        errors.password = 'Password is required';
    }
    return errors;
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Authentication Service (Mock Implementation)
export class AuthService {
    async login(credentials) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock authentication logic
        if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
            const user = {
                id: '1',
                email: credentials.email,
                name: 'Test User'
            };
            return {
                success: true,
                user
            };
        }
        else {
            return {
                success: false,
                error: 'Invalid credentials. Please try again.'
            };
        }
    }
}
