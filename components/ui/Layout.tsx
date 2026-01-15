import React from 'react';
import { LogOut, LayoutDashboard, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: 'dashboard' | 'editor' | 'auth';
  onNavigate: (page: 'dashboard' | 'editor' | 'auth') => void;
  userEmail?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, userEmail }) => {
  if (activePage === 'auth') {
    return <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-vortex-accent flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <Zap className="text-white w-5 h-5" fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Vortex<span className="text-vortex-accent">VSL</span></span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium transition-colors ${activePage === 'dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Dashboard
            </button>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
                {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <button 
                onClick={() => onNavigate('auth')}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};