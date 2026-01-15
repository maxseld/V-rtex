import React, { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { VSLConfig, DEFAULT_VSL } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [activePage, setActivePage] = useState<'auth' | 'dashboard' | 'editor'>('auth');
  const [userEmail, setUserEmail] = useState<string>('');
  const [projects, setProjects] = useState<VSLConfig[]>([]);
  const [currentProject, setCurrentProject] = useState<VSLConfig>(DEFAULT_VSL);
  const [loading, setLoading] = useState(true);

  // Buscar projetos do Supabase com filtro explícito de usuário (Segurança Extra)
  const fetchProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id) // Defesa em profundidade: não confia apenas no RLS
      .order('last_edited', { ascending: false });

    if (error) {
      console.error('Erro ao buscar projetos:', error);
      return;
    }

    if (data) {
      const formattedProjects: VSLConfig[] = data.map(item => ({
        id: item.id,
        name: item.name,
        videoUrl: item.video_url,
        ratio: item.ratio as any,
        primaryColor: item.primary_color,
        retentionSpeed: item.retention_speed,
        hasDelay: item.has_delay,
        delaySeconds: item.delay_seconds,
        views: item.views || 0,
        lastEdited: item.last_edited
      }));
      setProjects(formattedProjects);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email!);
        setActivePage('dashboard');
        await fetchProjects();
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email!);
        if (activePage === 'auth') {
          setActivePage('dashboard');
          await fetchProjects();
        }
      } else {
        setUserEmail('');
        setActivePage('auth');
        setProjects([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [activePage]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setActivePage('dashboard');
    fetchProjects();
  };

  const handleCreateNew = () => {
    setCurrentProject({
      ...DEFAULT_VSL,
      id: '',
      name: 'Novo Projeto VSL',
      lastEdited: new Date().toISOString()
    });
    setActivePage('editor');
  };

  const handleEditProject = (project: VSLConfig) => {
    setCurrentProject(project);
    setActivePage('editor');
  };

  const handleDeleteProject = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Garante que você só deleta o que te pertence

    if (error) {
      alert('Erro ao excluir projeto: ' + error.message);
    } else {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveProject = async (updatedConfig: VSLConfig) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Sessão expirada. Por favor, faça login novamente.');
      return;
    }

    const projectData = {
      name: updatedConfig.name,
      video_url: updatedConfig.videoUrl,
      ratio: updatedConfig.ratio,
      primary_color: updatedConfig.primaryColor,
      retention_speed: updatedConfig.retentionSpeed,
      has_delay: updatedConfig.hasDelay,
      delay_seconds: updatedConfig.delaySeconds,
      user_id: user.id,
      last_edited: new Date().toISOString()
    };

    let error;

    if (updatedConfig.id && updatedConfig.id !== '') {
      const { error: updateError } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', updatedConfig.id)
        .eq('user_id', user.id); // Garante que você só atualiza o que te pertence
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('projects')
        .insert([projectData]);
      error = insertError;
    }

    if (error) {
      console.error('Erro ao salvar projeto:', error);
      alert('Falha ao salvar. Verifique se você tem permissão para esta operação.');
    } else {
      await fetchProjects();
      setActivePage('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-vortex-accent/20 border-t-vortex-accent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Sincronizando Vortex...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activePage={activePage} onNavigate={setActivePage} userEmail={userEmail}>
      {activePage === 'auth' && <Auth onLogin={handleLogin} />}
      
      {activePage === 'dashboard' && (
        <Dashboard 
          projects={projects} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}
      
      {activePage === 'editor' && (
        <Editor 
          initialConfig={currentProject} 
          onSave={handleSaveProject}
          onBack={() => {
            fetchProjects();
            setActivePage('dashboard');
          }}
        />
      )}
    </Layout>
  );
}

export default App;