import React, { useState } from 'react';
import { Plus, Play, Calendar, Trash2, Search, BarChart3, AlertTriangle } from 'lucide-react';
import { VSLConfig } from '../types';

interface DashboardProps {
  projects: VSLConfig[];
  onCreateNew: () => void;
  onEdit: (project: VSLConfig) => void;
  onDelete: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onCreateNew, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Minhas VSLs</h1>
          <p className="text-slate-400">Gerencie e monitore o desempenho dos seus vídeos.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-vortex-accent hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all transform hover:translate-y-[-2px] hover:shadow-blue-900/40"
        >
          <Plus size={20} />
          Nova VSL
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 flex items-center gap-4 max-w-xl">
        <div className="p-2 text-slate-500">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Buscar projetos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-white w-full placeholder-slate-600"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
            <Play size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
          </h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">
            {searchTerm ? 'Tente buscar por outro termo ou limpe o filtro.' : 'Crie sua primeira VSL otimizada para conversão agora mesmo.'}
          </p>
          {!searchTerm && (
            <button 
              onClick={onCreateNew}
              className="text-vortex-accent hover:text-white font-medium hover:underline"
            >
              Criar primeiro projeto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-vortex-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 flex flex-col h-full"
            >
              {/* Thumbnail Mockup */}
              <div 
                className="aspect-video bg-slate-950 relative overflow-hidden group-hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => onEdit(project)}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                   <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: project.primaryColor }}
                   >
                     <Play size={20} fill="currentColor" className="ml-1" />
                   </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-white">
                  {project.ratio}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 
                    className="font-bold text-lg text-white group-hover:text-vortex-accent transition-colors line-clamp-1 cursor-pointer"
                    onClick={() => onEdit(project)}
                  >
                    {project.name}
                  </h3>
                  
                  {confirmDeleteId === project.id ? (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => onDelete(project.id)}
                            className="text-red-500 hover:text-red-400 p-1"
                            title="Confirmar Exclusão"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-slate-500 hover:text-white text-[10px] font-bold"
                        >
                            CANCELAR
                        </button>
                    </div>
                  ) : (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(project.id); }}
                        className="text-slate-600 hover:text-red-500 p-1 rounded-md hover:bg-slate-800 transition-colors"
                        title="Excluir Projeto"
                    >
                        <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="mt-auto flex items-center justify-between text-sm text-slate-400 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-1.5" title="Visualizações">
                    <BarChart3 size={14} className="text-slate-500" />
                    <span>{project.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Data de criação">
                    <Calendar size={14} className="text-slate-500" />
                    <span>{new Date(project.lastEdited).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-full z-50">
            <AlertTriangle size={24} className="text-red-200" />
            <div>
                <p className="text-sm font-bold">Atenção!</p>
                <p className="text-xs text-red-100">Confirme a exclusão do projeto. Esta ação é irreversível.</p>
            </div>
            <button 
                onClick={() => setConfirmDeleteId(null)}
                className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs font-bold"
            >
                Fechar
            </button>
        </div>
      )}
    </div>
  );
};