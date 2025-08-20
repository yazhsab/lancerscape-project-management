import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { SubmitProposalData, Proposal } from '../types/project';

export const useSubmitProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (proposalData: SubmitProposalData) => {
      const response = await api.post('/proposals/submit', proposalData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['project', variables.data.attributes.project_id] 
      });
    }
  });
};

export const useProjectProposals = (projectId: string) => {
  return useQuery({
    queryKey: ['proposals', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/proposals`);
      return response.data.proposals as Proposal[];
    },
    enabled: !!projectId
  });
};