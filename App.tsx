import React, { useState } from 'react';
import { Layout } from './components/ui/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { VSLConfig, DEFAULT_VSL } from './types';

function App() {
  const [activePage, setActivePage] = useState<'auth' | 'dashboard' | 'editor'>('auth');
  const [userEmail, setUserEmail] = useState<string>('');
  
  // Estado local para projetos (substitui o banco de dados)
  const [projects, setProjects] = useState<VSLConfig[]>([]);
  const [currentProject, setCurrentProject] = useState<VSLConfig>(DEFAULT_VSL);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setActivePage('dashboard');
  };

  const handleSignOut = () => {
    setUserEmail('');
    setActivePage('auth');
    // Opcional: Limpar projetos ao sair?
    // setProjects([]); 
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

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveProject = async (updatedConfig: VSLConfig) => {
    // Simular delay de salvamento para melhor UX
    await new Promise(resolve => setTimeout(resolve, 600));

    if (updatedConfig.id && updatedConfig.id !== '') {
      // Atualizar existente
      setProjects(prev => prev.map(p => 
        p.id === updatedConfig.id 
          ? { ...updatedConfig, lastEdited: new Date().toISOString() } 
          : p
      ));
    } else {
      // Criar novo
      const newProject = {
        ...updatedConfig,
        id: Date.now().toString(), // ID simples baseado em timestamp
        lastEdited: new Date().toISOString(),
        views: 0
      };
      setProjects(prev => [newProject, ...prev]);
    }
    
    setActivePage('dashboard');
  };

  return (
    <Layout 
      activePage={activePage} 
      onNavigate={setActivePage} 
      userEmail={userEmail}
      onSignOut={handleSignOut}
    >
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
            setActivePage('dashboard');
          }}
        />
      )}
    </Layout>
  );
}

export default App;