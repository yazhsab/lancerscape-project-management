import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Upload, X, Plus } from 'lucide-react';
import { useCreateProject } from '../../hooks/useProjects';
import Button from '../common/Button';

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  budget: z.number().min(5, 'Minimum budget is $5'),
  deadline: z.string().min(1, 'Deadline is required'),
  skills_required: z.array(z.string()).min(1, 'At least one skill is required'),
  project_type: z.enum(['fixed', 'hourly']),
  attachments: z.array(z.string())
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectWizard: React.FC<CreateProjectWizardProps> = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_type: 'fixed',
      skills_required: [],
      attachments: []
    }
  });

  const watchedFields = watch();

  const steps = [
    { title: 'Project Details', description: 'Tell us about your project' },
    { title: 'Budget & Timeline', description: 'Set your budget and deadline' },
    { title: 'Skills Required', description: 'What skills do you need?' },
    { title: 'Review & Submit', description: 'Review and create your project' }
  ];

  const availableSkills = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Digital Marketing',
    'Content Writing',
    'Data Entry',
    'Graphic Design',
    'SEO Services',
    'Social Media Management',
    'Translation (Hindi/English)',
    'Video Editing',
    'E-commerce Development'
  ];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setValue('skills_required', updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue('skills_required', updatedSkills);
  };

  const addAttachment = (url: string) => {
    if (url.trim() && !attachments.includes(url.trim())) {
      const updatedAttachments = [...attachments, url.trim()];
      setAttachments(updatedAttachments);
      setValue('attachments', updatedAttachments);
    }
  };

  const removeAttachment = (urlToRemove: string) => {
    const updatedAttachments = attachments.filter(url => url !== urlToRemove);
    setAttachments(updatedAttachments);
    setValue('attachments', updatedAttachments);
  };

  const nextStep = async () => {
    const fieldsToValidate: (keyof ProjectFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate.push('title', 'description');
        break;
      case 2:
        fieldsToValidate.push('budget', 'deadline', 'project_type');
        break;
      case 3:
        fieldsToValidate.push('skills_required');
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject.mutateAsync({
        data: {
          type: 'project',
          attributes: data
        }
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Project Title *
              </label>
              <input
                {...register('title')}
                placeholder="e.g., Build a responsive e-commerce website"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Project Description *
              </label>
              <textarea
                {...register('description')}
                rows={6}
                placeholder="Describe your project in detail. Include requirements, expectations, and any specific preferences..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {watchedFields.description?.length || 0}/2000 characters
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Project Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue('project_type', 'fixed')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    watchedFields.project_type === 'fixed'
                      ? 'border-[#FDB813] bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-[#222]">Fixed Price</h3>
                  <p className="text-sm text-gray-600">Pay a set amount for the entire project</p>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('project_type', 'hourly')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    watchedFields.project_type === 'hourly'
                      ? 'border-[#FDB813] bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-[#222]">Hourly Rate</h3>
                  <p className="text-sm text-gray-600">Pay for time worked on your project</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Budget (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  {...register('budget', { valueAsNumber: true })}
                  type="number"
                  min="5"
                  placeholder="25000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
                />
              </div>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Budget in Indian Rupees (₹). Typical projects range from ₹5,000 to ₹5,00,000
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Project Deadline *
              </label>
              <input
                {...register('deadline')}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Required Skills *
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill (e.g., React, Node.js)"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
                />
                <Button type="button" onClick={addSkill}>
                  <Plus size={16} />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#FDB813] text-[#222] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-yellow-600 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {errors.skills_required && (
                <p className="text-red-500 text-sm mt-2">{errors.skills_required.message}</p>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 mb-4">
                  Drag and drop files here or click to browse
                </p>
                <input
                  type="url"
                  placeholder="Or paste a file URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const url = (e.target as HTMLInputElement).value;
                      if (url) {
                        addAttachment(url);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
                />
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((url, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(url)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Summary */}
            <div className="bg-[#F5F5F5] rounded-lg p-6">
              <h3 className="font-semibold text-[#222] mb-4">Project Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Title:</span> {watchedFields.title}
                </div>
                <div>
                  <span className="font-medium">Budget:</span> ₹{watchedFields.budget?.toLocaleString('en-IN')}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {watchedFields.project_type}
                </div>
                <div>
                  <span className="font-medium">Deadline:</span> {watchedFields.deadline}
                </div>
                <div>
                  <span className="font-medium">Skills:</span> {skills.join(', ')}
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#222]">Create New Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? 'bg-[#FDB813] text-[#222]'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index + 1 < currentStep ? 'bg-[#FDB813]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-medium text-[#222]">{steps[currentStep - 1].title}</h3>
            <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                type="submit"
                loading={createProject.isPending}
                className="flex items-center gap-2"
              >
                Create Project
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProjectWizard;