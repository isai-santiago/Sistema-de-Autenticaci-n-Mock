import { Inter } from 'next/font/google';
import './global.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Providers from '@/components/Providers'; // <-- 1. Importa el Provider aquí

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning> 
      {/* Agregamos clases al body para que el fondo cambie con el tema */}
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}