import React from 'react';
import { User } from '@/lib/types';

interface UserCardProps {
    user: User;
    onDelete: (userId: string) => void;
    isDeleting: boolean;
}

export function UserCard({ user, onDelete, isDeleting }: UserCardProps) {
    return (
        <div className="border p-4 rounded">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <button onClick={() => onDelete(user.id)} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
}