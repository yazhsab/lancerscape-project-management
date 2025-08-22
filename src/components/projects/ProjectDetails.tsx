import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Star, 
  Clock, 
  FileText,
  MessageSquare,
  Award,
  ChevronLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useProjectDetails } from '../../hooks/useProjects';
import { useProjectProposals } from '../../hooks/useProposals';
import { useProjectMilestones } from '../../hooks/useMilestones';
import { useProjectFiles } from '../../hooks/useFiles';
import Badge from '../common/Badge';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ProposalSubmissionForm from '../proposals/ProposalSubmissionForm';
import MilestoneBoard from '../milestones/MilestoneBoard';
import FileManager from '../files/FileManager';

interface ProjectDetailsProps {
  projectId: string;
  onBack: () => void;
  userType?: 'freelancer' | 'client';
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projectId,
  onBack,
  userType = 'freelancer'
}) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'proposals' | 'milestones' | 'files'>('details');

  const { data: project, isLoading: projectLoading } = useProjectDetails(projectId);
  const { data: proposals, isLoading: proposalsLoading } = useProjectProposals(projectId);
  const { data: milestones, isLoading: milestonesLoading, refetch: refetchMilestones } = useProjectMilestones(projectId);
  const { data: files, isLoading: filesLoading } = useProjectFiles(projectId);

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-[#222] mb-2">Project not found</h3>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'in_progress': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#222]">{project.title}</h1>
            <Badge variant={getStatusVariant(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Posted {format(new Date(project.created_at), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{project.proposals_count} proposals</span>
            </div>
          </div>
        </div>
        {userType === 'freelancer' && project.status === 'open' && (
          <Button onClick={() => setShowProposalForm(true)}>
            Submit Proposal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-[#222] mb-4">Project Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>
          </motion.div>

          {/* Skills Required */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-[#222] mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-3">
              {project.skills_required.map((skill, index) => (
                <Badge key={index} variant="info" size="md">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Attachments */}
          {project.attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-[#222] mb-4">Attachments</h2>
              <div className="space-y-3">
                {project.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText size={20} className="text-gray-500" />
                    <a
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-[#222] hover:text-[#FDB813] transition-colors"
                    >
                      {attachment.split('/').pop() || attachment}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tabs for Client View */}
          {(userType === 'client' || project.status === 'in_progress') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100"
            >
              {/* Tab Headers */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'details'
                      ? 'text-[#FDB813] border-b-2 border-[#FDB813]'
                      : 'text-gray-600 hover:text-[#222]'
                  }`}
                >
                  Project Details
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'proposals'
                      ? 'text-[#FDB813] border-b-2 border-[#FDB813]'
                      : 'text-gray-600 hover:text-[#222]'
                  }`}
                >
                  Proposals ({proposals?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('milestones')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'milestones'
                      ? 'text-[#FDB813] border-b-2 border-[#FDB813]'
                      : 'text-gray-600 hover:text-[#222]'
                  }`}
                >
                  Milestones ({milestones?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'files'
                      ? 'text-[#FDB813] border-b-2 border-[#FDB813]'
                      : 'text-gray-600 hover:text-[#222]'
                  }`}
                >
                  Files ({files?.length || 0})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'milestones' && (
                  <div>
                    {milestonesLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : milestones && milestones.length > 0 ? (
                      <MilestoneBoard
                        projectId={projectId}
                        milestones={milestones}
                        onMilestoneUpdate={refetchMilestones}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-[#222] mb-2">No milestones yet</h3>
                        <p className="text-gray-600">Milestones will appear here once the project starts</p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'files' && (
                  <div>
                    {filesLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <FileManager
                        projectId={projectId}
                        files={files || []}
                        onFileUpload={(files, category, milestoneId) => {
                          // Handle file upload
                          console.log('Upload files:', files, category, milestoneId);
                        }}
                        onFileDelete={(fileId) => {
                          // Handle file delete
                          console.log('Delete file:', fileId);
                        }}
                        onFileDownload={(fileId) => {
                          // Handle file download
                          console.log('Download file:', fileId);
                        }}
                        userRole={userType}
                      />
                    )}
                  </div>
                )}
                
                {activeTab === 'proposals' && (
                  <div className="space-y-4">
                    {proposalsLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : proposals?.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-600">No proposals yet</p>
                      </div>
                    ) : (
                      proposals?.map((proposal) => (
                        <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-[#222]">Freelancer Name</h4>
                              <p className="text-sm text-gray-600">
                                Submitted {format(new Date(proposal.submitted_at), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#222]">
                                ${proposal.proposed_budget.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                {proposal.delivery_time} days delivery
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 line-clamp-3">
                            {proposal.cover_letter}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant={
                                proposal.status === 'accepted' ? 'success' :
                                proposal.status === 'rejected' ? 'error' : 'warning'
                              }
                            >
                              {proposal.status}
                            </Badge>
                            {proposal.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  Message
                                </Button>
                                <Button size="sm">
                                  Accept Proposal
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-lg font-bold text-[#222] mb-4">Project Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Budget</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#222]">
                    ₹{project.budget.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {project.project_type} price
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Deadline</span>
                <div className="text-right">
                  <p className="font-medium text-[#222]">
                    {format(new Date(project.deadline), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Proposals</span>
                <p className="font-medium text-[#222]">{project.proposals_count}</p>
              </div>
            </div>
          </motion.div>

          {/* Client Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-lg font-bold text-[#222] mb-4">About the Client</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#FDB813] rounded-full flex items-center justify-center text-[#222] font-bold text-xl">
                {project.client.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-[#222]">{project.client.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  <span className="text-sm text-gray-600">
                    {project.client.rating} rating
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Award className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  {project.client.total_projects} projects posted
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  Member since {format(new Date(project.created_at), 'yyyy')}
                </span>
              </div>
            </div>

            {userType === 'freelancer' && (
              <Button variant="outline" className="w-full mt-4">
                <MessageSquare size={16} className="mr-2" />
                Message Client
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Proposal Submission Form */}
      {showProposalForm && (
        <ProposalSubmissionForm
          projectId={projectId}
          project={project}
          onClose={() => setShowProposalForm(false)}
          onSuccess={() => setShowProposalForm(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;