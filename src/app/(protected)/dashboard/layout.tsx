import { Sidebar } from './Sidebar';
import { DashboardHeader } from './Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        // Le decimos que el fondo principal sea oscuro cuando esté activo el tema
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />
                {/* El fondo de la zona principal también debe cambiar */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}