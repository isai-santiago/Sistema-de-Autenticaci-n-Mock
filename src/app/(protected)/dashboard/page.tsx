'use client';
import React, { useEffect, useState } from 'react';
import { UsersTable } from '@/components/users/UsersTable';
import { User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('mock_users');
        if (stored) setUsers(JSON.parse(stored));

        const logs = JSON.parse(localStorage.getItem('zeryux_audit_logs') || '[]');
        setAuditLogs(logs);
    }, []);

    const handleDeleteUser = (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar a este usuario permanentemente?')) {
            const userToDelete = users.find(u => u.id === id);
            const updatedUsers = users.filter(u => u.id !== id);
            
            setUsers(updatedUsers);
            localStorage.setItem('mock_users', JSON.stringify(updatedUsers));

            const logEntry = { 
                email: currentUser?.email || 'Admin', 
                date: new Date().toLocaleString(), 
                action: `Eliminó permanentemente a ${userToDelete?.name || 'un usuario'}` 
            };
            const updatedLogs = [logEntry, ...auditLogs]; 
            setAuditLogs(updatedLogs);
            localStorage.setItem('zeryux_audit_logs', JSON.stringify(updatedLogs));
        }
    };

    const handleRoleChange = (id: string, newRole: 'admin' | 'user' | 'special_perms') => {
        if (window.confirm(`¿Cambiar el rol de este usuario a ${newRole.toUpperCase()}?`)) {
            const updatedUsers = users.map(u => 
                u.id === id ? { ...u, role: newRole } : u
            );
            setUsers(updatedUsers);
            localStorage.setItem('mock_users', JSON.stringify(updatedUsers));

            const userChanged = users.find(u => u.id === id);
            const logEntry = { 
                email: currentUser?.email || 'Admin', 
                date: new Date().toLocaleString(), 
                action: `Cambió el rol de ${userChanged?.name} a ${newRole}` 
            };
            const updatedLogs = [logEntry, ...auditLogs]; 
            setAuditLogs(updatedLogs);
            localStorage.setItem('zeryux_audit_logs', JSON.stringify(updatedLogs));
        }
    };

    // ¿Puede ver la auditoría?
    const canViewHistory = currentUser?.role === 'admin' || currentUser?.role === 'special_perms';

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-2 sm:p-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Gestión de Usuarios</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Administra los accesos y roles de tu sistema.</p>
            </div>
            
            <UsersTable 
                users={users} 
                onDelete={handleDeleteUser} 
                onRoleChange={handleRoleChange} 
            />

            {/* 👇 AQUI ESTÁ LA CORRECCIÓN: Si NO es admin o special, esto ni siquiera se dibuja 👇 */}
            {canViewHistory && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registro de Auditoría (Live)</h3>
                        </div>
                        <button 
                            onClick={() => setIsHistoryOpen(true)}
                            className="text-xs font-bold bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all border border-blue-200 dark:border-slate-700"
                        >
                            Ver Historial Completo
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {auditLogs.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">No se han registrado accesos recientes.</p>
                        ) : (
                            auditLogs.slice(0, 5).map((log, index) => (
                                <div key={index} className="flex justify-between items-center text-sm p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white dark:bg-slate-800 flex items-center justify-center border border-gray-200 dark:border-slate-700 shadow-sm">
                                            🛡️
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{log.email}</p>
                                            <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">{log.action}</p>
                                        </div>
                                    </div>
                                    <span className="text-slate-500 font-mono text-xs">{log.date}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* MODAL DE HISTORIAL COMPLETO */}
            {isHistoryOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)}></div>
                    <div className="relative bg-white dark:bg-[#0b1120] w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Log de Auditoría Completo</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Registro histórico de todas las acciones del sistema.</p>
                            </div>
                            <button onClick={() => setIsHistoryOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {auditLogs.map((log, i) => (
                                <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{log.email}</span>
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-mono">{log.date}</span>
                                        </div>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">{log.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}