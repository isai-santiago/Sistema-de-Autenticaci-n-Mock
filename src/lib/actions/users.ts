
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { User } from '../types';

const CreateUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['admin', 'user'])
});

export async function createUser(formData: FormData) {
    // ✅ Server-side validation
    const validatedFields = CreateUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    const { name, email, role } = validatedFields.data;

    try {
        // ✅ Server-side database operation
        const response = await fetch(`${process.env.API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_TOKEN}`
            },
            body: JSON.stringify({ name, email, role })
        });

        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        // ✅ Revalidate cache
        revalidatePath('/dashboard/users');

    } catch (error) {
        return {
            message: 'Database Error: Failed to create user'
        };
    }

    // ✅ Redirect after success
    redirect('/dashboard/users');
}

export async function deleteUser(userId: string) {
    try {
        // Mock deletion logic (replace with real DB/API call)
        console.log(`Deleting user with ID: ${userId}`);
        // Example: await db.user.delete({ where: { id: userId } });
        // For now, just simulate success
        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
}

const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'admin@indaptados.com', // <-- Asegúrate que termine en .com
        name: 'Zeryux Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
        preferences: { theme: 'dark', language: 'es', notifications: true }
    }
];

// Y en la validación del login:
const validPasswords = {
    'admin@indaptados.edu': 'Admin123' // <-- Esta es la que debes escribir
};