import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Users, Star, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Project } from '../../types/project';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
  showProposalButton?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onViewDetails,
  showProposalButton = true 
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'in_progress': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getProjectTypeColor = (type: string) => {
    return type === 'fixed' ? 'text-green-600' : 'text-blue-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#222] mb-2 line-clamp-2">
            {project.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span className={`font-semibold ${getProjectTypeColor(project.project_type)}`}>
                ₹{project.budget.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span className="capitalize">{project.project_type}</span>
            </div>
          </div>
        </div>
        <Badge variant={getStatusVariant(project.status)}>
          {project.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.skills_required.slice(0, 4).map((skill, index) => (
          <Badge key={index} variant="info" size="sm">
            {skill}
          </Badge>
        ))}
        {project.skills_required.length > 4 && (
          <Badge variant="default" size="sm">
            +{project.skills_required.length - 4} more
          </Badge>
        )}
      </div>

      {/* Client Info & Proposals */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FDB813] rounded-full flex items-center justify-center text-[#222] font-bold">
            {project.client.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[#222]">{project.client.name}</p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span>{project.client.rating}</span>
              <span>•</span>
              <span>{project.client.total_projects} projects</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users size={16} />
            <span>{project.proposals_count} proposals</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails(project.id)}
        >
          View Details
        </Button>
        {showProposalButton && project.status === 'open' && (
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => onViewDetails(project.id)}
          >
            Submit Proposal
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;