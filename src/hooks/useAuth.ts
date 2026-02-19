import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext'; // Asegúrate de exportar AuthContext en tu archivo de contexto

// Si tu AuthContext.tsx no exporta el Contexto directamente, tendrás que ajustarlo.
// Pero normalmente, este hook ya viene incluido dentro del archivo AuthContext.tsx al final.
// Si ya lo tienes dentro de AuthContext.tsx, puedes borrar este archivo o dejarlo así:

/* IMPORTANTE: Si en AuthContext.tsx ya tienes "export const useAuth = ...", 
   entonces NO necesitas este archivo. 
   Pero si el reto te lo pide por separado:
*/

export const useAuthHook = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};