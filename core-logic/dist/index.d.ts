import type { LoginCredentials, LoginResult } from '@ai-coding/shared-types';
export declare function validateLoginCredentials(credentials: LoginCredentials): Record<string, string>;
export declare class AuthService {
    login(credentials: LoginCredentials): Promise<LoginResult>;
}
//# sourceMappingURL=index.d.ts.map