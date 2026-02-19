// src/lib/api/users.ts
import { UserFilters } from '@/hooks/useUsers';

export async function getUsers(filters: UserFilters) {
    // 1. Simulamos el retraso de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Traemos los usuarios reales desde el localStorage
    let users = [];
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('mock_users');
        if (stored) {
            users = JSON.parse(stored);
        }
    }

    // Si por alguna razón el localStorage está vacío, ponemos datos de respaldo
    if (users.length === 0) {
        users = [
            { id: '1', name: 'Zeryux', email: 'zeryux@indaptados.edu', role: 'admin' },
            { id: '2', name: 'Admin', email: 'admin@indaptados.edu', role: 'Admin123' },
            { id: '3', name: 'Invitado', email: 'invitado@test.com', role: 'user' }
        ];
    }

    // 3. ¡Hacemos que funcione la barra de búsqueda!
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        users = users.filter((u: any) => 
            u.name?.toLowerCase().includes(searchLower) || 
            u.email?.toLowerCase().includes(searchLower)
        );
    }

    // 4. Hacemos que funcione la paginación (10 usuarios por página)
    const page = filters.page || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);

    return {
        users: paginatedUsers,
        total: users.length
    };
}