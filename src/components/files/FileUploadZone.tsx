import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  Archive,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useFileUpload } from '../../hooks/useFiles';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface FileUploadZoneProps {
  projectId: string;
  category: string;
  milestoneId?: string;
  onUploadComplete: () => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  multiple?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  projectId,
  category,
  milestoneId,
  onUploadComplete,
  maxFileSize = 50, // 50MB default
  allowedTypes = ['*'],
  multiple = true
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileUpload = useFileUpload();

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
    if (type.startsWith('video/')) return <Video size={20} className="text-purple-500" />;
    if (type.startsWith('audio/')) return <Music size={20} className="text-green-500" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText size={20} className="text-red-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive size={20} className="text-orange-500" />;
    return <File size={20} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes('*')) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isAllowed = allowedTypes.some(type => 
        type === fileExtension || 
        file.type.includes(type.replace('*', ''))
      );
      
      if (!isAllowed) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const invalidFiles: { file: File; error: string }[] = [];

    // Validate files
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        invalidFiles.push({ file, error });
      } else {
        validFiles.push(file);
      }
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ file, error }) => {
        console.error(`${file.name}: ${error}`);
        // You could show toast notifications here
      });
    }

    if (validFiles.length === 0) return;

    // Initialize uploading files state
    const uploadingFilesState: UploadingFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(uploadingFilesState);

    try {
      // Simulate upload progress (in real implementation, you'd track actual progress)
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => 
          prev.map(uf => ({
            ...uf,
            progress: Math.min(uf.progress + Math.random() * 30, 90)
          }))
        );
      }, 500);

      await fileUpload.mutateAsync({
        projectId,
        files: validFiles,
        category,
        milestoneId
      });

      clearInterval(progressInterval);

      // Mark all as completed
      setUploadingFiles(prev => 
        prev.map(uf => ({
          ...uf,
          progress: 100,
          status: 'completed'
        }))
      );

      // Clear after 2 seconds
      setTimeout(() => {
        setUploadingFiles([]);
        onUploadComplete();
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadingFiles(prev => 
        prev.map(uf => ({
          ...uf,
          status: 'error',
          error: 'Upload failed'
        }))
      );
    }
  }, [projectId, category, milestoneId, fileUpload, onUploadComplete, maxFileSize, allowedTypes]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    e.target.value = '';
  }, [handleFiles]);

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragOver 
            ? 'border-[#FDB813] bg-yellow-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${fileUpload.isPending ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <motion.div
          animate={{ scale: dragOver ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload 
            className={`mx-auto mb-4 ${dragOver ? 'text-[#FDB813]' : 'text-gray-400'}`} 
            size={48} 
          />
        </motion.div>
        
        <h3 className="text-lg font-medium text-[#222] mb-2">
          {dragOver ? 'Drop files here' : 'Upload Files'}
        </h3>
        
        <p className="text-gray-600 mb-4">
          Drag and drop files here or click to browse
        </p>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>Maximum file size: {maxFileSize}MB</p>
          {allowedTypes.length > 0 && !allowedTypes.includes('*') && (
            <p>Allowed types: {allowedTypes.join(', ')}</p>
          )}
        </div>
        
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          accept={allowedTypes.includes('*') ? undefined : allowedTypes.map(t => `.${t}`).join(',')}
        />
      </div>

      {/* Uploading Files */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-medium text-[#222]">Uploading Files</h4>
            
            {uploadingFiles.map((uploadingFile, index) => (
              <motion.div
                key={`${uploadingFile.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadingFile.file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-[#222] truncate">
                        {uploadingFile.file.name}
                      </h5>
                      
                      <div className="flex items-center gap-2">
                        {uploadingFile.status === 'completed' && (
                          <CheckCircle size={16} className="text-green-500" />
                        )}
                        {uploadingFile.status === 'error' && (
                          <AlertCircle size={16} className="text-red-500" />
                        )}
                        {uploadingFile.status === 'uploading' && (
                          <LoadingSpinner size="sm" />
                        )}
                        
                        <button
                          onClick={() => removeUploadingFile(index)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{formatFileSize(uploadingFile.file.size)}</span>
                      <span>{uploadingFile.progress.toFixed(0)}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadingFile.status === 'completed' ? 'bg-green-500' :
                          uploadingFile.status === 'error' ? 'bg-red-500' :
                          'bg-[#FDB813]'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                    
                    {uploadingFile.error && (
                      <p className="text-red-500 text-sm mt-2">{uploadingFile.error}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;