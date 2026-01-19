import React, { useState } from 'react';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de delay de rede
    setTimeout(() => {
      onLogin(email);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-vortex-accent mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.6)] mb-4">
          <Zap className="text-white w-7 h-7" fill="currentColor" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Vortex VSL</h1>
        <p className="text-slate-400">Entre na sua conta para gerenciar seus players (Modo Local).</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex gap-4 mb-6 border-b border-slate-800 pb-4">
          <button 
            className={`flex-1 pb-2 text-sm font-medium transition-all ${isLogin ? 'text-vortex-accent border-b-2 border-vortex-accent' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setIsLogin(true)}
          >
            Entrar
          </button>
          <button 
            className={`flex-1 pb-2 text-sm font-medium transition-all ${!isLogin ? 'text-vortex-accent border-b-2 border-vortex-accent' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setIsLogin(false)}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-vortex-accent/50 focus:border-vortex-accent transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Senha (Simulado)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-vortex-accent/50 focus:border-vortex-accent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-vortex-accent hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                {isLogin ? 'Acessar Dashboard' : 'Criar Conta Local'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};