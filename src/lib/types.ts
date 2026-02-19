export type UserRole = 'admin' | 'special_perms' | 'user';


export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    createdAt: string;
    preferences: {
        theme: 'light' | 'dark';
        language: 'es' | 'en';
        notifications: boolean;
        twoFactorEnabled?: boolean;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials, code2fa?: string) => Promise<{ requires2FA: boolean } | void>;    
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
    clearError: () => void;
}

export interface ValidationErrors {
    [key: string]: string;
}