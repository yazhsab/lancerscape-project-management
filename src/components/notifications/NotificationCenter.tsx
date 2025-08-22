import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Settings,
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Info,
  DollarSign,
  FileText,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  useNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead,
  useDeleteNotification,
  Notification 
} from '../../hooks/useNotifications';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const filteredNotifications = notifications?.filter(notification => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'read' && notification.read) || 
      (filter === 'unread' && !notification.read);
    
    const matchesTypeFilter = selectedType === 'all' || notification.type === selectedType;
    
    return matchesReadFilter && matchesTypeFilter;
  }) || [];

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'project_update': return <FileText size={16} className="text-blue-500" />;
      case 'milestone_complete': return <CheckCircle size={16} className="text-green-500" />;
      case 'proposal_received': return <MessageSquare size={16} className="text-purple-500" />;
      case 'payment_received': return <DollarSign size={16} className="text-green-500" />;
      case 'message': return <MessageSquare size={16} className="text-blue-500" />;
      case 'system': return <Info size={16} className="text-gray-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-gray-300';
      default: return 'border-l-gray-300';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
    
    // Handle navigation based on notification data
    if (notification.data?.projectId) {
      // Navigate to project
      console.log('Navigate to project:', notification.data.projectId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-4">
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="text-[#FDB813]" size={24} />
              <h2 className="text-xl font-bold text-[#222]">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="error" size="sm">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllAsRead.mutate()}
              disabled={unreadCount === 0}
            >
              <Check size={14} className="mr-1" />
              Mark All Read
            </Button>
            <Button size="sm" variant="ghost">
              <Settings size={14} />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Filter by:</span>
          </div>
          
          <div className="flex gap-2 mb-3">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-[#FDB813] text-[#222]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FDB813]"
          >
            <option value="all">All Types</option>
            <option value="project_update">Project Updates</option>
            <option value="milestone_complete">Milestones</option>
            <option value="proposal_received">Proposals</option>
            <option value="payment_received">Payments</option>
            <option value="message">Messages</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-20">
              <Bell className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-lg font-medium text-[#222] mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === 'unread' ? 'All caught up!' : 'You have no notifications yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`
                      p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:bg-gray-50
                      ${notification.read ? 'bg-white' : 'bg-blue-50'}
                      ${getPriorityColor(notification.priority)}
                    `}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`font-medium text-sm ${
                            notification.read ? 'text-gray-700' : 'text-[#222]'
                          }`}>
                            {notification.title}
                          </h4>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#FDB813] rounded-full"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification.mutate(notification.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={12} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                        
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationCenter;