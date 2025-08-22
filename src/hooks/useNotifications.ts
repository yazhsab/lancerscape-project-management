import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export interface Notification {
  id: string;
  type: 'project_update' | 'milestone_complete' | 'proposal_received' | 'payment_received' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    projectId?: string;
    milestoneId?: string;
    proposalId?: string;
    userId?: string;
  };
  priority: 'low' | 'medium' | 'high';
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data.notifications as Notification[];
    }
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.put('/notifications/mark-all-read');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    milestoneUpdates: true,
    proposalUpdates: true,
    paymentUpdates: true,
    marketingEmails: false
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      const response = await api.put('/notifications/settings', newSettings);
      return response.data;
    },
    onSuccess: (data) => {
      setSettings(data.settings);
    }
  });

  return {
    settings,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending
  };
};