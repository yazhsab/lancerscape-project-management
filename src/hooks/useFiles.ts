import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { useWebSocket } from './useWebSocket';

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
  const { sendMessage } = useWebSocket('current-user-id'); // You'd get this from auth context
  
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

      // Simulate file upload with progress tracking
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              files: files.map((file, index) => ({
                id: `file-${Date.now()}-${index}`,
                name: file.name,
                type: 'file',
                mimeType: file.type,
                size: file.size,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString(),
                uploadedBy: {
                  id: 'current-user-id',
                  name: 'Current User',
                  role: 'freelancer'
                },
                category,
                milestoneId
              }))
            }
          });
        }, 2000);
      });

      /* Real implementation would be:
      const response = await api.post(`/projects/${projectId}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Update progress state
        }
      });
      */

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-files', variables.projectId] });
      
      // Send WebSocket notification
      sendMessage({
        type: 'file_upload',
        data: {
          projectId: variables.projectId,
          files: data.files,
          category: variables.category
        }
      });
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