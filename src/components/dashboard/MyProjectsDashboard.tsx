import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useMyProjects } from '../../hooks/useProjects';
import { Project } from '../../types/project';
import ProjectCard from '../projects/ProjectCard';
import CreateProjectWizard from '../projects/CreateProjectWizard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import Badge from '../common/Badge';

interface MyProjectsDashboardProps {
  userType: 'freelancer' | 'client';
  onProjectSelect: (projectId: string) => void;
}

const MyProjectsDashboard: React.FC<MyProjectsDashboardProps> = ({
  userType,
  onProjectSelect
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const { data: projects, isLoading } = useMyProjects(userType);

  const filteredProjects = projects?.filter(project => 
    statusFilter === 'all' || project.status === statusFilter
  ) || [];

  const getStatusStats = () => {
    if (!projects) return {};
    
    return projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusStats = getStatusStats();

  const getStatIcon = (status: string) => {
    switch (status) {
      case 'open': return Clock;
      case 'in_progress': return TrendingUp;
      case 'completed': return CheckCircle;
      default: return Calendar;
    }
  };

  const getStatColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600';
      case 'in_progress': return 'text-yellow-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

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
          <h1 className="text-3xl font-bold text-[#222]">
            My Projects
          </h1>
          <p className="text-gray-600 mt-1">
            {userType === 'client' ? 'Projects you\'ve posted on LancerScape' : 'Your active projects and proposals'}
          </p>
        </div>
        
        {userType === 'client' && (
          <Button
            onClick={() => setShowCreateWizard(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Project
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries({
          all: projects?.length || 0,
          open: statusStats.open || 0,
          in_progress: statusStats.in_progress || 0,
          completed: statusStats.completed || 0
        }).map(([status, count]) => {
          const Icon = getStatIcon(status);
          const isActive = statusFilter === status;
          
          return (
            <motion.div
              key={status}
              whileHover={{ y: -2 }}
              onClick={() => setStatusFilter(status)}
              className={`
                bg-white rounded-xl shadow-lg p-6 border cursor-pointer transition-all
                ${isActive ? 'border-[#FDB813] bg-yellow-50' : 'border-gray-100 hover:border-gray-200'}
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 capitalize">
                    {status.replace('_', ' ')} {status === 'all' ? 'Projects' : ''}
                  </p>
                  <p className="text-2xl font-bold text-[#222] mt-1">{count}</p>
                </div>
                <Icon className={`${getStatColor(status)} ${isActive ? 'text-[#FDB813]' : ''}`} size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All Projects' },
              { key: 'open', label: 'Open' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === key
                    ? 'bg-[#FDB813] text-[#222]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
                {statusStats[key] && key !== 'all' && (
                  <span className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
                    {statusStats[key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-[#222] mb-2">
            {statusFilter === 'all' ? 'No projects yet' : `No ${statusFilter.replace('_', ' ')} projects`}
          </h3>
          <p className="text-gray-600 mb-6">
            {userType === 'client' 
              ? 'Start by posting your first project to connect with talented Indian freelancers'
              : 'Browse available projects from Indian clients and start submitting proposals'
            }
          </p>
          {userType === 'client' && (
            <Button onClick={() => setShowCreateWizard(true)}>
              Post Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={onProjectSelect}
              showProposalButton={false}
            />
          ))}
        </div>
      )}

      {/* Create Project Wizard */}
      {showCreateWizard && (
        <CreateProjectWizard
          onClose={() => setShowCreateWizard(false)}
          onSuccess={() => setShowCreateWizard(false)}
        />
      )}
    </div>
  );
};

export default MyProjectsDashboard;