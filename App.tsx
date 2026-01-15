import React, { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { VSLConfig, DEFAULT_VSL } from './types';

function App() {
  const [activePage, setActivePage] = useState<'auth' | 'dashboard' | 'editor'>('auth');
  const [userEmail, setUserEmail] = useState<string>('');
  const [projects, setProjects] = useState<VSLConfig[]>([]);
  const [currentProject, setCurrentProject] = useState<VSLConfig>(DEFAULT_VSL);

  // Load mocks on mount
  useEffect(() => {
    const saved = localStorage.getItem('vortex_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
        // Mock initial Data
        setProjects([
            {
                ...DEFAULT_VSL,
                id: '1',
                name: 'VSL Oferta Black Friday',
                views: 1240,
                primaryColor: '#ef4444',
                lastEdited: new Date().toISOString()
            },
            {
                ...DEFAULT_VSL,
                id: '2',
                name: 'Lead Magnet - Vertical',
                ratio: '9:16',
                views: 532,
                primaryColor: '#22c55e',
                lastEdited: new Date(Date.now() - 86400000).toISOString()
            }
        ]);
    }
  }, []);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setActivePage('dashboard');
  };

  const handleCreateNew = () => {
    setCurrentProject({
      ...DEFAULT_VSL,
      id: Date.now().toString(),
      name: 'Novo Projeto VSL',
      lastEdited: new Date().toISOString()
    });
    setActivePage('editor');
  };

  const handleEditProject = (project: VSLConfig) => {
    setCurrentProject(project);
    setActivePage('editor');
  };

  const handleSaveProject = (updatedConfig: VSLConfig) => {
    const exists = projects.find(p => p.id === updatedConfig.id);
    let newProjects;
    
    if (exists) {
      newProjects = projects.map(p => p.id === updatedConfig.id ? {...updatedConfig, lastEdited: new Date().toISOString()} : p);
    } else {
      newProjects = [...projects, {...updatedConfig, lastEdited: new Date().toISOString()}];
    }
    
    setProjects(newProjects);
    localStorage.setItem('vortex_projects', JSON.stringify(newProjects));
    // Don't navigate back immediately, let user see feedback or copy code
    // Optional: Toast notification here
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage} userEmail={userEmail}>
      {activePage === 'auth' && <Auth onLogin={handleLogin} />}
      
      {activePage === 'dashboard' && (
        <Dashboard 
          projects={projects} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEditProject}
        />
      )}
      
      {activePage === 'editor' && (
        <Editor 
          initialConfig={currentProject} 
          onSave={handleSaveProject}
          onBack={() => setActivePage('dashboard')}
        />
      )}
    </Layout>
  );
}

export default App;