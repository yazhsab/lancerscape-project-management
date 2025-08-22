import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  FileText,
  Plus,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { Milestone } from '../../types/project';
import { useUpdateMilestone, useCompleteMilestone } from '../../hooks/useMilestones';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface MilestoneBoardProps {
  projectId: string;
  milestones: Milestone[];
  onMilestoneUpdate: () => void;
}

interface MilestoneCardProps {
  milestone: Milestone;
  onStatusChange: (milestoneId: string, status: Milestone['status']) => void;
  onComplete: (milestoneId: string) => void;
}

const ItemTypes = {
  MILESTONE: 'milestone'
};

const MilestoneCard: React.FC<MilestoneCardProps> = ({ 
  milestone, 
  onStatusChange, 
  onComplete 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.MILESTONE,
    item: { id: milestone.id, status: milestone.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'in_progress': return <Play size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const isOverdue = new Date(milestone.deadline) < new Date() && milestone.status !== 'completed';

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-move
        ${isDragging ? 'opacity-50' : ''}
        ${isOverdue ? 'border-red-300 bg-red-50' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-[#222] mb-1">{milestone.title}</h4>
          <div className="flex items-center gap-2">
            <Badge variant={milestone.status === 'completed' ? 'success' : 
                          milestone.status === 'in_progress' ? 'warning' : 'default'}>
              <div className="flex items-center gap-1">
                {getStatusIcon(milestone.status)}
                <span className="capitalize">{milestone.status.replace('_', ' ')}</span>
              </div>
            </Badge>
            {isOverdue && (
              <Badge variant="error">
                <AlertCircle size={12} className="mr-1" />
                Overdue
              </Badge>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              {milestone.status !== 'completed' && (
                <>
                  <button
                    onClick={() => {
                      onStatusChange(milestone.id, 'in_progress');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  >
                    Start Work
                  </button>
                  <button
                    onClick={() => {
                      onComplete(milestone.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  >
                    Mark Complete
                  </button>
                </>
              )}
              <button
                onClick={() => setShowMenu(false)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-500"
              >
                Edit Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {milestone.description}
      </p>

      {/* Amount and Deadline */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 text-sm">
          <DollarSign size={14} className="text-green-600" />
          <span className="font-medium text-green-600">
            ₹{milestone.amount.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar size={14} />
          <span>{format(new Date(milestone.deadline), 'MMM dd')}</span>
        </div>
      </div>

      {/* Deliverables */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Deliverables ({milestone.deliverables.length})
        </p>
        <div className="space-y-1">
          {milestone.deliverables.slice(0, 2).map((deliverable, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <FileText size={12} className="text-gray-400" />
              <span className="text-gray-600 truncate">{deliverable}</span>
            </div>
          ))}
          {milestone.deliverables.length > 2 && (
            <p className="text-xs text-gray-500">
              +{milestone.deliverables.length - 2} more
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface ColumnProps {
  title: string;
  status: Milestone['status'];
  milestones: Milestone[];
  onDrop: (milestoneId: string, newStatus: Milestone['status']) => void;
  onStatusChange: (milestoneId: string, status: Milestone['status']) => void;
  onComplete: (milestoneId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  title, 
  status, 
  milestones, 
  onDrop, 
  onStatusChange, 
  onComplete 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.MILESTONE,
    drop: (item: { id: string; status: Milestone['status'] }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getColumnColor = (status: Milestone['status']) => {
    switch (status) {
      case 'pending': return 'border-gray-300';
      case 'in_progress': return 'border-yellow-300';
      case 'completed': return 'border-green-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <div
      ref={drop}
      className={`
        flex-1 bg-gray-50 rounded-lg p-4 min-h-[600px]
        ${isOver ? 'bg-blue-50 border-2 border-blue-300' : `border-2 ${getColumnColor(status)}`}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#222] flex items-center gap-2">
          {title}
          <span className="bg-white px-2 py-1 rounded-full text-sm">
            {milestones.length}
          </span>
        </h3>
      </div>
      
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            onStatusChange={onStatusChange}
            onComplete={onComplete}
          />
        ))}
        
        {milestones.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus size={20} />
            </div>
            <p className="text-sm">No milestones</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MilestoneBoard: React.FC<MilestoneBoardProps> = ({ 
  projectId, 
  milestones, 
  onMilestoneUpdate 
}) => {
  const updateMilestone = useUpdateMilestone();
  const completeMilestone = useCompleteMilestone();

  const handleDrop = async (milestoneId: string, newStatus: Milestone['status']) => {
    try {
      await updateMilestone.mutateAsync({
        milestoneId,
        updates: { status: newStatus }
      });
      onMilestoneUpdate();
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  const handleStatusChange = async (milestoneId: string, status: Milestone['status']) => {
    try {
      await updateMilestone.mutateAsync({
        milestoneId,
        updates: { status }
      });
      onMilestoneUpdate();
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  const handleComplete = async (milestoneId: string) => {
    try {
      await completeMilestone.mutateAsync(milestoneId);
      onMilestoneUpdate();
    } catch (error) {
      console.error('Failed to complete milestone:', error);
    }
  };

  const groupedMilestones = {
    pending: milestones.filter(m => m.status === 'pending'),
    in_progress: milestones.filter(m => m.status === 'in_progress'),
    completed: milestones.filter(m => m.status === 'completed')
  };

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const completedAmount = groupedMilestones.completed.reduce((sum, m) => sum + m.amount, 0);
  const progressPercentage = totalAmount > 0 ? (completedAmount / totalAmount) * 100 : 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Progress Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#222]">Project Progress</h2>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#222]">
                ₹{completedAmount.toLocaleString('en-IN')} / ₹{totalAmount.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600">{progressPercentage.toFixed(1)}% Complete</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#FDB813] h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{groupedMilestones.pending.length}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{groupedMilestones.in_progress.length}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{groupedMilestones.completed.length}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#222]">Milestone Board</h2>
            <Button size="sm">
              <Plus size={16} className="mr-2" />
              Add Milestone
            </Button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto">
            <Column
              title="Pending"
              status="pending"
              milestones={groupedMilestones.pending}
              onDrop={handleDrop}
              onStatusChange={handleStatusChange}
              onComplete={handleComplete}
            />
            <Column
              title="In Progress"
              status="in_progress"
              milestones={groupedMilestones.in_progress}
              onDrop={handleDrop}
              onStatusChange={handleStatusChange}
              onComplete={handleComplete}
            />
            <Column
              title="Completed"
              status="completed"
              milestones={groupedMilestones.completed}
              onDrop={handleDrop}
              onStatusChange={handleStatusChange}
              onComplete={handleComplete}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MilestoneBoard;