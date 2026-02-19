'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';

export function DashboardHeader() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, updateProfile } = useAuth(); 
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <>
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Panel de Control</h1>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-800 p-1.5 pr-4 rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                    >
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold overflow-hidden border border-transparent">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                            {user?.name || 'Usuario'}
                        </span>
                    </button>
                </div>
            </header>

            {isProfileOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsProfileOpen(false)} />
            )}

            <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tu Perfil</h2>
                        <button onClick={() => setIsProfileOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-600 dark:hover:text-gray-300 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-4 overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'Usuario Prueba'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'usuario@correo.com'}</p>
                        
                        {/* 👇 AQUI ESTÁ LA CORRECCIÓN: Soporte visual para los 3 roles 👇 */}
                        <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            user?.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300' :
                            user?.role === 'special_perms' ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300' :
                            'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                        }`}>
                            {user?.role === 'admin' ? 'Administrador' : user?.role === 'special_perms' ? 'Permisos Especiales' : 'Usuario'}
                        </span>
                    </div>

                    <div className="flex-1 border-t border-gray-100 dark:border-slate-800 pt-6">
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider mb-4">Apariencia</p>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🌙</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</span>
                            </div>
                            {mounted && (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={theme === 'dark'}
                                        onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    />
                                    <div className="w-11 h-6 bg-gray-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            setIsProfileOpen(false);
                            if(logout) logout();
                        }}
                        className="w-full py-3 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors mt-auto"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
}