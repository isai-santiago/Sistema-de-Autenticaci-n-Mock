// components/users/UsersList.tsx
'use client'; // ✅ Client Component directive

import { useState, useTransition } from 'react';
import { deleteUser } from '@/lib/actions/users';
import { User } from '@/lib/types';
import { UserCard } from './UserCard';
import { toast } from 'sonner';

interface UsersListProps {
    users: User[];
}

export function UsersList({ users }: UsersListProps) {
    const [userList, setUserList] = useState(users);
    const [isPending, startTransition] = useTransition();

    const handleDeleteUser = (userId: string) => {
        // ✅ Client-side interaction
        startTransition(async () => {
            try {
                await deleteUser(userId);
                setUserList(prev => prev.filter(u => u.id !== userId));
                toast.success('User deleted successfully');
            } catch (error) {
                toast.error('Failed to delete user');
            }
        });
    };

    return (
        <div className="space-y-4">
            {userList.map(user => (
                <UserCard
                    key={user.id}
                    user={user}
                    onDelete={handleDeleteUser}
                    isDeleting={isPending}
                />
            ))}
        </div>
    );
}