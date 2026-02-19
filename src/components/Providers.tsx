'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
// Importamos la configuración que ya tienes creada
import { queryClient } from '@/lib/queryClient'; 

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
        </ThemeProvider>
    );
}