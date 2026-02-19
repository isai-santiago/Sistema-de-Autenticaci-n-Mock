'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
    const { user, logout, updateProfile } = useAuth();
    
    // Estados para los inputs editables
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [notifications, setNotifications] = useState(true);
    // 👇 NUEVO: Estado para el 2FA
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    
    // Estados de carga y éxito
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sincronizamos los datos del usuario con los inputs al cargar
    useEffect(() => {
        if (user) {
            setEditName(user.name);
            setEditEmail(user.email);
            if (user.preferences) {
                setNotifications(user.preferences.notifications);
                // 👇 NUEVO: Sincroniza el estado del 2FA
                setTwoFactorEnabled(user.preferences.twoFactorEnabled || false);
            }
        }
    }, [user]);

    // 1. Lógica para guardar el Nombre y Correo
    const handleSaveProfile = async () => {
        if (!updateProfile || !user) return;
        setIsSavingProfile(true);
        setSuccessMsg('');
        try {
            await updateProfile({ name: editName, email: editEmail });
            setSuccessMsg('¡Datos actualizados correctamente!');
            setTimeout(() => setSuccessMsg(''), 3000); 
        } catch (error) {
            console.error("Error al guardar perfil", error);
        } finally {
            setIsSavingProfile(false);
        }
    };

    // 2. Lógica para los Toggles (Notificaciones y 2FA)
    const handleNotificationToggle = async () => {
        const newValue = !notifications;
        setNotifications(newValue);
        if (updateProfile && user) {
            await updateProfile({ 
                preferences: { ...user.preferences, notifications: newValue } as any
            });
        }
    };

    // 👇 NUEVO: Función para cambiar el 2FA
    const handle2FAToggle = async () => {
        const newValue = !twoFactorEnabled;
        setTwoFactorEnabled(newValue);
        if (updateProfile && user) {
            await updateProfile({ 
                preferences: { ...user.preferences, twoFactorEnabled: newValue } as any
            });
        }
    };

    // 3. Lógica para subir el Avatar
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !updateProfile) return;

        setIsUpdatingAvatar(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64String = reader.result as string;
                await updateProfile({ avatar: base64String });
            } catch (error) {
                console.error("Error al guardar el avatar", error);
            } finally {
                setIsUpdatingAvatar(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // 4. Lógica para Eliminar Cuenta
    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm(
            '⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?\nEsta acción te borrará del sistema.'
        );
        if (confirmDelete && user) {
            const storedUsers = localStorage.getItem('mock_users');
            if (storedUsers) {
                const usersArray = JSON.parse(storedUsers);
                const updatedUsers = usersArray.filter((u: any) => u.id !== user.id);
                localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
            }
            if (logout) logout();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Ajustes de la Cuenta</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Administra tus preferencias y la seguridad de tu perfil.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
                {/* --- SECCIÓN PERFIL --- */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Personal</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold transition-colors overflow-hidden border-2 border-transparent">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'U'
                                )}
                            </div>
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                            <button onClick={handleAvatarClick} disabled={isUpdatingAvatar} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                {isUpdatingAvatar ? 'Subiendo...' : 'Cambiar foto'}
                            </button>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                                    <input 
                                        type="text" 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input 
                                        type="email" 
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors" 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 pt-2">
                                <Button 
                                    onClick={handleSaveProfile} 
                                    isLoading={isSavingProfile}
                                    className="w-auto"
                                >
                                    Guardar Cambios
                                </Button>
                                {successMsg && (
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400 animate-pulse">
                                        {successMsg}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN PREFERENCIAS --- */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seguridad y Preferencias</h2>
                    <div className="space-y-4">
                        
                        {/* Notificaciones */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Notificaciones por Email</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Recibe alertas sobre nuevos inicios de sesión.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={notifications} onChange={handleNotificationToggle} />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* 👇 NUEVO: Autenticación 2FA */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors border border-blue-100 dark:border-blue-900/30">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-gray-900 dark:text-white">Autenticación de 2 Pasos (2FA)</h3>
                                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">Recomendado</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Añade una capa extra de seguridad al iniciar sesión.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={twoFactorEnabled} onChange={handle2FAToggle} />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                    </div>
                </div>

                {/* --- ZONA DE PELIGRO --- */}
                <div className="p-6 bg-red-50/30 dark:bg-red-500/5 transition-colors">
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Zona de Peligro</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Estas acciones son irreversibles y afectarán tu cuenta permanentemente.</p>
                    <Button variant="danger" className="w-auto" onClick={handleDeleteAccount}>
                        Eliminar mi cuenta
                    </Button>
                </div>
            </div>
        </div>
    );
}