'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUsers } from '@/lib/api/users';
import { createUser, deleteUser as deleteUserAction } from '@/lib/actions/users';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserFilters {
  page: number;
  search: string;
}

// Hook para obtener usuarios
export const useUsers = (filters: UserFilters) => {
    return useQuery({
        queryKey: ['users', filters],
        queryFn: () => getUsers(filters),
    });
};

// Hook para crear usuarios
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: Partial<User> & { password?: string }) => {
            const formData = new FormData();
            formData.append('name', userData.name || '');
            formData.append('email', userData.email || '');
            formData.append('password', userData.password || '');
            
            // Le decimos a TypeScript qué estructura tiene result
            const result = await createUser(formData) as { errors?: any, message?: string, user: User };
            
            if (result.errors) throw new Error(result.message || 'Error al crear');
            return result.user; 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Usuario creado con éxito');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
};

// Hook para eliminar usuarios (Unificado con React Query)
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => deleteUserAction(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Usuario eliminado');
        },
        onError: () => {
            toast.error('Error al eliminar usuario');
        }
    });
};