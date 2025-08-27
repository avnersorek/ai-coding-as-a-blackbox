export interface LoginCredentials {
    email: string;
    password: string;
}
export interface AuthUser {
    id: string;
    email: string;
    name?: string;
}
export interface LoginFormState {
    credentials: LoginCredentials;
    errors: Record<string, string | undefined>;
    isSubmitting: boolean;
}
export interface LoginResult {
    success: boolean;
    user?: AuthUser;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map