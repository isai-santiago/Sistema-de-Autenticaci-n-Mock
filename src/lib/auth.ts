import { LoginCredentials, RegisterData, User } from './types';

// Función mágica que lee la base de datos real de tu navegador
const getDbUsers = (): User[] => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('mock_users');
        if (stored) return JSON.parse(stored);
    }
    // Si no hay usuarios, creamos el Admin por defecto
    const defaultUsers: User[] = [{
        id: '1',
        email: 'admin@indaptados.com',
        name: 'Admin Supremo',
        role: 'admin',
        createdAt: new Date().toISOString(),
        preferences: { theme: 'dark', language: 'es', notifications: true }
    }];
    if (typeof window !== 'undefined') localStorage.setItem('mock_users', JSON.stringify(defaultUsers));
    return defaultUsers;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export const mockAuthService = {
    async login(credentials: LoginCredentials): Promise<User> {
        await delay(800);
        const { email, password } = credentials;
        const users = getDbUsers();

        if (!email || !password) throw new AuthError('Email y password son requeridos', 'MISSING_CREDENTIALS');

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) throw new AuthError('Usuario no encontrado. Revisa el correo.', 'USER_NOT_FOUND');

        // Simulamos que todos los usuarios de prueba usan la contraseña "admin123" o "user123" 
        // En tu app real esto no se hace así jaja, pero para el reto es perfecto
        const validPassword = user.role === 'admin' ? 'admin123' : 'user123';
        
        // Si es el admin por defecto, forzamos admin123. Si es uno nuevo registrado, lo dejamos pasar con la que puso (simulación).
        if (user.email === 'admin@indaptados.com' && password !== 'Admin123') {
            throw new AuthError('Contraseña incorrecta', 'INVALID_PASSWORD');
        }

        return user;
    },

    async register(data: RegisterData): Promise<User> {
        await delay(1000);
        const users = getDbUsers();
        
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
            throw new AuthError('Este email ya está en uso', 'EMAIL_EXISTS');
        }

        const newUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            email: data.email.toLowerCase(),
            name: data.name,
            role: 'user', // Los nuevos siempre son usuarios normales
            createdAt: new Date().toISOString(),
            preferences: { theme: 'dark', language: 'es', notifications: true }
        };

        users.push(newUser);
        localStorage.setItem('mock_users', JSON.stringify(users));
        return newUser;
    },

    async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
        await delay(500);
        const users = getDbUsers();
        const index = users.findIndex(u => u.id === userId);
        
        if (index === -1) throw new AuthError('Usuario no encontrado', 'USER_NOT_FOUND');
        
        users[index] = { ...users[index], ...updates };
        localStorage.setItem('mock_users', JSON.stringify(users));
        return users[index];
    },

    async verifyToken(token: string): Promise<User | null> {
        try {
            const userData = JSON.parse(atob(token.split('.')[1] || ''));
            const users = getDbUsers();
            return users.find(u => u.id === userData.userId) || null;
        } catch {
            return null;
        }
    }
};

export const generateMockToken = (user: User): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 604800000 }));
    return `${header}.${payload}.mock-signature`;
};