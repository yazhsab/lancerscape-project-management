import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { Milestone } from '../types/project';

export const useProjectMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/milestones`);
      return response.data.milestones as Milestone[];
    },
    enabled: !!projectId
  });
};

export const useCreateMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, milestone }: { projectId: string, milestone: Omit<Milestone, 'id'> }) => {
      const response = await api.post(`/projects/${projectId}/milestones`, milestone);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.projectId] });
    }
  });
};

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ milestoneId, updates }: { milestoneId: string, updates: Partial<Milestone> }) => {
      const response = await api.put(`/milestones/${milestoneId}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    }
  });
};

export const useCompleteMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await api.post(`/milestones/${milestoneId}/complete`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    }
  });
};