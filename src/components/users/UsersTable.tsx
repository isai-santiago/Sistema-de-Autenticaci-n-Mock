'use client';

import React from 'react';
import { User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface UsersTableProps {
    users: User[];
    onDelete: (id: string) => void;
    onRoleChange: (id: string, newRole: 'admin' | 'user' | 'special_perms') => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onDelete, onRoleChange }) => {
    const { user: currentUser } = useAuth();
    const SUPER_ADMIN_EMAIL = 'admin@indaptados.com';

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-gray-200 dark:border-slate-800">
                    <tr>
                        <th className="px-6 py-4">Usuario</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Fecha de Registro</th>
                        <th className="px-6 py-4">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                    {users.map((u) => {
                        // REGLAS
                        const isSuperAdmin = u.email === SUPER_ADMIN_EMAIL;
                        const isTargetingSelf = u.id === currentUser?.id;
                        const isCurrentUserMainAdmin = currentUser?.email === SUPER_ADMIN_EMAIL;
                        const isCurrentUserAdmin = currentUser?.role === 'admin';

                        // 1. ¿Quién puede borrar? (Special Perms YA NO PUEDE)
                        let canDelete = false;
                        if (!isSuperAdmin && !isTargetingSelf) {
                            if (isCurrentUserMainAdmin) canDelete = true;
                            else if (isCurrentUserAdmin && u.role !== 'admin') canDelete = true;
                        }

                        // 2. ¿Quién puede cambiar roles?
                        let canChangeRole = false;
                        if (!isSuperAdmin && !isTargetingSelf) {
                            if (isCurrentUserMainAdmin) canChangeRole = true;
                            else if (isCurrentUserAdmin && u.role !== 'admin') canChangeRole = true;
                        }

                        return (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden border border-blue-500">
                                        {u.avatar ? <img src={u.avatar} alt="avatar" className="w-full h-full object-cover" /> : u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-medium">
                                            {u.name} {isSuperAdmin && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded ml-1 uppercase">Root</span>}
                                        </p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs">{u.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => onRoleChange(u.id, e.target.value as 'admin' | 'user' | 'special_perms')}
                                        disabled={!canChangeRole}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all appearance-none text-center border ${
                                            u.role === 'admin' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30' :
                                            u.role === 'special_perms' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30' :
                                            'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30'
                                        } ${!canChangeRole ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                                    >
                                        {/* 👇 AQUI ESTÁ LA CORRECCIÓN: Siempre se dibuja la opción correcta del usuario actual 👇 */}
                                        {(isCurrentUserMainAdmin || u.role === 'admin') && <option value="admin">Administrador</option>}
                                        {(isCurrentUserMainAdmin || isCurrentUserAdmin || u.role === 'special_perms') && <option value="special_perms">Permisos Especiales</option>}
                                        <option value="user">Usuario</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                    {new Date(u.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                    {canDelete ? (
                                        <button 
                                            onClick={() => onDelete(u.id)}
                                            className="text-red-500 hover:text-red-600 font-semibold transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/10"
                                        >
                                            Eliminar
                                        </button>
                                    ) : (
                                        <span className="text-slate-400 text-xs italic opacity-50">Protegido</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};