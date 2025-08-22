import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size: number;
  url?: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
    role: 'client' | 'freelancer';
  };
  category: 'requirement' | 'deliverable' | 'reference' | 'other';
  milestoneId?: string;
}

export const useProjectFiles = (projectId: string) => {
  return useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/files`);
      return response.data.files as FileItem[];
    },
    enabled: !!projectId
  });
};

export const useFileUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      projectId, 
      files, 
      category, 
      milestoneId 
    }: { 
      projectId: string;
      files: File[];
      category: string;
      milestoneId?: string;
    }) => {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      formData.append('category', category);
      if (milestoneId) {
        formData.append('milestoneId', milestoneId);
      }

      const response = await api.post(`/projects/${projectId}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-files', variables.projectId] });
    }
  });
};

export const useFileDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, fileId }: { projectId: string; fileId: string }) => {
      const response = await api.delete(`/projects/${projectId}/files/${fileId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-files', variables.projectId] });
    }
  });
};

export const useFileDownload = () => {
  return useMutation({
    mutationFn: async ({ projectId, fileId }: { projectId: string; fileId: string }) => {
      const response = await api.get(`/projects/${projectId}/files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : 'download';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    }
  });
};