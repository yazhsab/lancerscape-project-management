import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import { useSubmitProposal } from '../../hooks/useProposals';
import { Project } from '../../types/project';
import Button from '../common/Button';

const milestoneSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  deadline: z.string().min(1, 'Deadline is required'),
  deliverables: z.array(z.string()).min(1, 'At least one deliverable required')
});

const proposalSchema = z.object({
  cover_letter: z.string()
    .min(100, 'Cover letter must be at least 100 characters')
    .max(1000, 'Cover letter must be less than 1000 characters'),
  proposed_budget: z.number().min(5).max(50000),
  delivery_time: z.number().min(1).max(365),
  milestones: z.array(milestoneSchema).min(1, 'At least one milestone required')
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalSubmissionFormProps {
  projectId: string;
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

const ProposalSubmissionForm: React.FC<ProposalSubmissionFormProps> = ({
  projectId,
  project,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const submitProposal = useSubmitProposal();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      proposed_budget: project.budget,
      delivery_time: 30,
      milestones: [{
        title: '',
        description: '',
        amount: project.budget,
        deadline: '',
        deliverables: ['']
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'milestones'
  });

  const watchedFields = watch();

  const steps = [
    { title: 'Cover Letter', description: 'Introduce yourself and your approach' },
    { title: 'Budget & Timeline', description: 'Set your price and delivery time' },
    { title: 'Milestones', description: 'Break down your project phases' }
  ];

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProposalFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['cover_letter'];
        break;
      case 2:
        fieldsToValidate = ['proposed_budget', 'delivery_time'];
        break;
      case 3:
        fieldsToValidate = ['milestones'];
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

  const onSubmit = async (data: ProposalFormData) => {
    try {
      await submitProposal.mutateAsync({
        data: {
          type: 'proposal',
          attributes: {
            project_id: projectId,
            ...data
          }
        }
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to submit proposal:', error);
    }
  };

  const addMilestone = () => {
    append({
      title: '',
      description: '',
      amount: 0,
      deadline: '',
      deliverables: ['']
    });
  };

  const addDeliverable = (milestoneIndex: number) => {
    const currentDeliverables = watchedFields.milestones[milestoneIndex]?.deliverables || [];
    setValue(`milestones.${milestoneIndex}.deliverables`, [...currentDeliverables, '']);
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    const currentDeliverables = watchedFields.milestones[milestoneIndex]?.deliverables || [];
    const newDeliverables = currentDeliverables.filter((_, index) => index !== deliverableIndex);
    setValue(`milestones.${milestoneIndex}.deliverables`, newDeliverables);
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
                Cover Letter *
              </label>
              <textarea
                {...register('cover_letter')}
                rows={8}
                placeholder="Dear Client,

I am excited about your project and believe I am the perfect fit because...

Here's how I would approach your project:
1. [First step]
2. [Second step]
3. [Final delivery]

I have [X years] of experience with [relevant skills] and have completed [number] similar projects.

Looking forward to discussing your project further.

Best regards,
[Your Name]"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
              />
              {errors.cover_letter && (
                <p className="text-red-500 text-sm mt-1">{errors.cover_letter.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {watchedFields.cover_letter?.length || 0}/1000 characters
                (minimum 100 required)
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-yellow-800 mb-2">Client's Budget</h4>
              <p className="text-yellow-700">
                The client has set a budget of <strong>₹{project.budget.toLocaleString('en-IN')}</strong> for this project.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Your Proposed Budget (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input
                  {...register('proposed_budget', { valueAsNumber: true })}
                  type="number"
                  min="5"
                  max="50000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
                />
              </div>
              {errors.proposed_budget && (
                <p className="text-red-500 text-sm mt-1">{errors.proposed_budget.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Be competitive but fair to your expertise. Consider current Indian freelancing market rates.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Delivery Time (Days) *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...register('delivery_time', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="365"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
                />
              </div>
              {errors.delivery_time && (
                <p className="text-red-500 text-sm mt-1">{errors.delivery_time.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Client's deadline: {new Date(project.deadline).toLocaleDateString()}
              </p>
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
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-[#222]">Project Milestones</h4>
                <Button type="button" onClick={addMilestone} size="sm">
                  <Plus size={16} className="mr-1" />
                  Add Milestone
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Break your project into milestones to build trust and ensure smooth progress.
              </p>
            </div>

            <div className="space-y-6">
              {fields.map((field, milestoneIndex) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#F5F5F5] rounded-lg p-6 relative"
                >
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(milestoneIndex)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <h5 className="font-medium text-[#222] mb-4">
                    Milestone {milestoneIndex + 1}
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-[#222] mb-1">
                        Title *
                      </label>
                      <input
                        {...register(`milestones.${milestoneIndex}.title`)}
                        placeholder="e.g., Initial Design Concepts"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
                      />
                      {errors.milestones?.[milestoneIndex]?.title && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.milestones[milestoneIndex]?.title?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#222] mb-1">
                        Amount ($) *
                      </label>
                      <input
                        {...register(`milestones.${milestoneIndex}.amount`, { valueAsNumber: true })}
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
                      />
                      {errors.milestones?.[milestoneIndex]?.amount && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.milestones[milestoneIndex]?.amount?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-[#222] mb-1">
                        Description *
                      </label>
                      <textarea
                        {...register(`milestones.${milestoneIndex}.description`)}
                        rows={3}
                        placeholder="Describe what will be delivered in this milestone..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
                      />
                      {errors.milestones?.[milestoneIndex]?.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.milestones[milestoneIndex]?.description?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#222] mb-1">
                        Deadline *
                      </label>
                      <input
                        {...register(`milestones.${milestoneIndex}.deadline`)}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        max={project.deadline}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
                      />
                      {errors.milestones?.[milestoneIndex]?.deadline && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.milestones[milestoneIndex]?.deadline?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-[#222]">
                        Deliverables *
                      </label>
                      <button
                        type="button"
                        onClick={() => addDeliverable(milestoneIndex)}
                        className="text-[#FDB813] hover:text-[#e6a611] text-sm"
                      >
                        + Add Deliverable
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {watchedFields.milestones[milestoneIndex]?.deliverables?.map((_, deliverableIndex) => (
                        <div key={deliverableIndex} className="flex gap-2">
                          <input
                            {...register(`milestones.${milestoneIndex}.deliverables.${deliverableIndex}`)}
                            placeholder="e.g., 3 design concepts with source files"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
                          />
                          {watchedFields.milestones[milestoneIndex]?.deliverables?.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDeliverable(milestoneIndex, deliverableIndex)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Budget Summary */}
            <div className="bg-white border border-[#FDB813] rounded-lg p-4">
              <h5 className="font-medium text-[#222] mb-2">Budget Summary</h5>
              <div className="space-y-1 text-sm">
                {watchedFields.milestones.map((milestone, index) => (
                  <div key={index} className="flex justify-between">
                    <span>Milestone {index + 1}:</span>
                    <span>₹{(milestone.amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t pt-1 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>
                    ₹{watchedFields.milestones.reduce((sum, m) => sum + (m.amount || 0), 0).toLocaleString('en-IN')}
                  </span>
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#222]">Submit Proposal</h2>
            <p className="text-gray-600 mt-1">{project.title}</p>
          </div>
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
            >
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                loading={submitProposal.isPending}
              >
                Submit Proposal
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProposalSubmissionForm;