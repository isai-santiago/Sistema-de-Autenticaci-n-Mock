import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b1120] relative flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-blue-500/30">
      
      {/* Efectos de luces de fondo (Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Insignia de estado */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium backdrop-blur-sm shadow-xl">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Sistema en Línea (Mock Environment)
          </span>
        </div>

        {/* Título y Descripción */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
            Administrator <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Auth</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Plataforma avanzada de control de acceso. Implementación robusta de Context API, rutas protegidas y validaciones en tiempo real.
          </p>
        </div>
        
        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/login" 
            className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] flex items-center justify-center gap-3"
          >
            Ingresar al Panel
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-4 bg-slate-800/50 text-white border border-slate-700 rounded-xl font-bold hover:bg-slate-800 hover:border-slate-600 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
          >
            Crear Cuenta
          </Link>
        </div>

        {/* Tecnologías (Pie de página del Hero) */}
        <div className="pt-20 flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div> 
            <span>Next.js App Router</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> 
            <span>React Context</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-400"></div> 
            <span>Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div> 
            <span>TypeScript</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}