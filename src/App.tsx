import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/navigation/Navigation';
import ProjectBrowser from './components/projects/ProjectBrowser';
import ProjectDetails from './components/projects/ProjectDetails';
import MyProjectsDashboard from './components/dashboard/MyProjectsDashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

type UserType = 'freelancer' | 'client';
type ViewType = 'browse' | 'my-projects' | 'create' | 'project-details';

function App() {
  const [userType, setUserType] = useState<UserType>('freelancer');
  const [activeView, setActiveView] = useState<ViewType>('browse');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    setActiveView(view as ViewType);
    if (view !== 'project-details') {
      setSelectedProjectId(null);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveView('project-details');
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveView('browse');
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'browse':
        return (
          <ProjectBrowser
            onProjectSelect={handleProjectSelect}
            showCreateButton={userType === 'client'}
            userType={userType}
          />
        );
      
      case 'my-projects':
        return (
          <MyProjectsDashboard
            userType={userType}
            onProjectSelect={handleProjectSelect}
          />
        );
      
      case 'create':
        return (
          <ProjectBrowser
            onProjectSelect={handleProjectSelect}
            showCreateButton={true}
            userType={userType}
          />
        );
      
      case 'project-details':
        return selectedProjectId ? (
          <ProjectDetails
            projectId={selectedProjectId}
            onBack={handleBackToProjects}
            userType={userType}
          />
        ) : null;
      
      default:
        return (
          <ProjectBrowser
            onProjectSelect={handleProjectSelect}
            showCreateButton={userType === 'client'}
            userType={userType}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#F5F5F5]">
        <Navigation
          activeView={activeView}
          onViewChange={handleViewChange}
          userType={userType}
          onUserTypeChange={setUserType}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${selectedProjectId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;