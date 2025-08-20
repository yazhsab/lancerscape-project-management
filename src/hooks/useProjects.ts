import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { Project, ProjectFilters, CreateProjectData } from '../types/project';

export const useProjectFilters = () => {
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    categories: [],
    budget_min: 0,
    budget_max: 10000,
    duration: 'all',
    skills: [],
    client_rating: 0,
    project_type: 'all',
    sort: 'newest'
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['projects', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/coupons/special_offers/get_service_provider', {
        params: {
          ...filters,
          page: pageParam,
          date: new Date().toISOString().split('T')[0]
        }
      });
      
      return {
        projects: response.data.projects || [],
        nextPage: response.data.has_more ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    filters, 
    setFilters 
  };
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      const response = await api.post('/projects/create', projectData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
    }
  });
};

export const useProjectDetails = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/details`);
      return response.data as Project;
    },
    enabled: !!projectId
  });
};

export const useMyProjects = (userType: 'freelancer' | 'client') => {
  return useQuery({
    queryKey: ['my-projects', userType],
    queryFn: async () => {
      const endpoint = userType === 'freelancer' 
        ? '/service_provider/projects/my-projects'
        : '/client/projects/my-projects';
      const response = await api.get(endpoint);
      return response.data.projects as Project[];
    }
  });
};