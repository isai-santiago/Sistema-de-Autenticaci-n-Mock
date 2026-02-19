'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { AuthContextType, AuthState, User, LoginCredentials, RegisterData } from '@/lib/types';
import { mockAuthService, generateMockToken } from '@/lib/auth';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_USER'; payload: User }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING': return { ...state, isLoading: action.payload };
        case 'SET_USER': return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
        case 'SET_ERROR': return { ...state, error: action.payload, isLoading: false };
        case 'CLEAR_ERROR': return { ...state, error: null };
        case 'LOGOUT': return { ...state, user: null, isAuthenticated: false, error: null, isLoading: false };
        default: return state;
    }
};

const initialState: AuthState = { user: null, isLoading: false, isAuthenticated: false, error: null };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [storedToken, setStoredToken] = useLocalStorage<string | null>('auth_token', null);

    const logout = useCallback(() => {
        setStoredToken(null);
        dispatch({ type: 'LOGOUT' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let isMounted = true;
        const initializeAuth = async () => {
            if (storedToken) {
                dispatch({ type: 'SET_LOADING', payload: true });
                try {
                    const user = await mockAuthService.verifyToken(storedToken);
                    if (user && isMounted) {
                        dispatch({ type: 'SET_USER', payload: user });
                    } else if (isMounted) {
                        logout();
                    }
                } catch { 
                    if (isMounted) logout(); 
                }
            }
        };
        
        initializeAuth();
        return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storedToken]); 

   const login = useCallback(async (credentials: LoginCredentials, code2fa?: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });
        try {
            // 1. Validamos las credenciales reales primero en el backend mock
            const user = await mockAuthService.login(credentials);

            // 2. Si la contraseña es correcta, verificamos si el usuario activó el 2FA
            if (user.preferences?.twoFactorEnabled) {
                // Si no nos han mandado el código aún, detenemos todo y pedimos el código
                if (!code2fa) {
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return { requires2FA: true }; 
                }
                // Si mandaron código pero es incorrecto, lanzamos error
                if (code2fa !== '123456') {
                    throw new Error('Código de seguridad incorrecto.');
                }
            }

            // 3. Si no tiene 2FA o el código fue correcto, completamos la sesión
            setStoredToken(generateMockToken(user));
            dispatch({ type: 'SET_USER', payload: user });

            // Audit Log
            const logEntry = { 
                email: user.email, 
                date: new Date().toLocaleString(), 
                action: 'Inicio de sesión exitoso' 
            };
            const currentLogs = JSON.parse(localStorage.getItem('zeryux_audit_logs') || '[]');
            localStorage.setItem('zeryux_audit_logs', JSON.stringify([logEntry, ...currentLogs].slice(0, 5)));

            return { requires2FA: false };

        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });
        try {
            const user = await mockAuthService.register(data);
            setStoredToken(generateMockToken(user));
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateProfile = useCallback(async (updates: Partial<User>) => {
        if (!state.user) return;
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const updatedUser = await mockAuthService.updateProfile(state.user.id, updates);
            dispatch({ type: 'SET_USER', payload: updatedUser });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.user]);

    const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

    const value = useMemo(() => ({
        ...state, login, register, logout, updateProfile, clearError
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [state, login, register, logout, updateProfile, clearError]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};