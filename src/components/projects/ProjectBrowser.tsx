import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Grid, List } from 'lucide-react';
import { useProjectFilters } from '../../hooks/useProjects';
import ProjectCard from './ProjectCard';
import ProjectFilters from './ProjectFilters';
import CreateProjectWizard from './CreateProjectWizard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

interface ProjectBrowserProps {
  onProjectSelect: (projectId: string) => void;
  showCreateButton?: boolean;
  userType?: 'freelancer' | 'client';
}

const ProjectBrowser: React.FC<ProjectBrowserProps> = ({
  onProjectSelect,
  showCreateButton = false,
  userType = 'freelancer'
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    filters,
    setFilters
  } = useProjectFilters();

  const projects = data?.pages?.flatMap(page => page.projects) || [];

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#222]">Browse Projects</h1>
          <p className="text-gray-600 mt-1">
            {projects.length} projects found
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-[#FDB813] text-[#222]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-[#FDB813] text-[#222]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={16} />
            </button>
          </div>

          {/* Create Project Button */}
          {showCreateButton && (
            <Button
              onClick={() => setShowCreateWizard(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Post Project
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProjectFilters
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
        </div>

        {/* Projects Grid */}
        <div className="lg:col-span-3">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-[#222] mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search criteria to find projects from Indian clients
              </p>
              {showCreateButton && (
                <Button onClick={() => setShowCreateWizard(true)}>
                  Post Your First Project on LancerScape
                </Button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 xl:grid-cols-2 gap-6'
                  : 'space-y-4'
              }
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={onProjectSelect}
                  showProposalButton={userType === 'freelancer'}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          )}

          {hasNextPage && !isFetchingNextPage && projects.length > 0 && (
            <div className="flex justify-center py-8">
              <Button variant="outline" onClick={() => fetchNextPage()}>
                Load More Projects
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Wizard */}
      {showCreateWizard && (
        <CreateProjectWizard
          onClose={() => setShowCreateWizard(false)}
          onSuccess={() => {
            setShowCreateWizard(false);
            // Could add success toast here
          }}
        />
      )}
    </div>
  );
};

export default ProjectBrowser;