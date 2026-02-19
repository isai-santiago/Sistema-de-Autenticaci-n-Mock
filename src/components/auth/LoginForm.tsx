'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login({ email, password });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* 1. FORZAMOS EL CUADRO: bg-white en claro, dark:bg-slate-900 en oscuro */
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 transition-all duration-300">
// 1. EL TÍTULO (Fuerza el color text-slate-900)
<div className="text-center mb-8">
    <h2 className="text-3xl font-bold !text-slate-900">
        Iniciar Sesión
    </h2>
    <p className="text-sm !text-slate-500 mt-2 font-medium">
        Panel Administrativo Zeryux
    </p>
</div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@indaptados.com"
                    required
                />
                
                <Input
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                <Button type="submit" isLoading={isLoading} className="w-full py-3 shadow-lg shadow-blue-500/30">
                    Entrar
                </Button>
            </form>

// 2. EL TEXTO DE ABAJO (Fuerza el color text-slate-600)
<div className="mt-8 pt-6 border-t border-gray-100 text-center">
    <p className="text-sm !text-slate-600 font-medium mt-6">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Regístrate
        </Link>
    </p>
</div>
</div>
    );
}