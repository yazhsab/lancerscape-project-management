import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Share2,
  Folder,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { useFileUpload, useFileDelete, useFileDownload } from '../../hooks/useFiles';
import FileUploadZone from './FileUploadZone';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

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

interface FileManagerProps {
  projectId: string;
  files: FileItem[];
  onFileUpload: (files: File[], category: string, milestoneId?: string) => void;
  onFileDelete: (fileId: string) => void;
  onFileDownload: (fileId: string) => void;
  userRole: 'client' | 'freelancer';
}

const FileManager: React.FC<FileManagerProps> = ({
  projectId,
  files,
  onFileUpload,
  onFileDelete,
  onFileDownload,
  userRole
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>('other');
  
  const fileUpload = useFileUpload();
  const fileDelete = useFileDelete();
  const fileDownload = useFileDownload();

  const categories = [
    { key: 'all', label: 'All Files', color: 'default' },
    { key: 'requirement', label: 'Requirements', color: 'info' },
    { key: 'deliverable', label: 'Deliverables', color: 'success' },
    { key: 'reference', label: 'References', color: 'warning' },
    { key: 'other', label: 'Other', color: 'default' }
  ];

  const filteredFiles = files.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File size={20} />;
    
    if (mimeType.startsWith('image/')) return <Image size={20} />;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText size={20} />;
    return <File size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileUpload = (files: File[], category: string, milestoneId?: string) => {
    onFileUpload(files, category, milestoneId);
    setShowUploadModal(false);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const FileUploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#222]">Upload Files</h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <FileUploadZone
            projectId={projectId}
            category={uploadCategory}
            onUploadComplete={() => setShowUploadModal(false)}
            maxFileSize={50}
            multiple={true}
          />
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#222] mb-2">
              Category
            </label>
            <select 
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
            >
              <option value="requirement">Requirements</option>
              <option value="deliverable">Deliverables</option>
              <option value="reference">References</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const FileCard = ({ file }: { file: FileItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white rounded-lg shadow-md border p-4 cursor-pointer transition-all
        ${selectedFiles.includes(file.id) ? 'border-[#FDB813] bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={() => toggleFileSelection(file.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getFileIcon(file.mimeType)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[#222] truncate">{file.name}</h4>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Badge variant={categories.find(c => c.key === file.category)?.color as any}>
            {categories.find(c => c.key === file.category)?.label}
          </Badge>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#FDB813] rounded-full flex items-center justify-center text-xs font-medium text-[#222]">
            {file.uploadedBy.name.charAt(0)}
          </div>
          <span>{file.uploadedBy.name}</span>
        </div>
        <span>{format(new Date(file.uploadedAt), 'MMM dd')}</span>
      </div>
      
      <div className="flex gap-2 mt-3">
        <Button size="sm" variant="outline" className="flex-1">
          <Eye size={14} className="mr-1" />
          View
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => fileDownload.mutate({ projectId, fileId: file.id })}
        >
          <Download size={14} className="mr-1" />
          Download
        </Button>
      </div>
    </motion.div>
  );

  const FileListItem = ({ file }: { file: FileItem }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        bg-white border rounded-lg p-4 flex items-center gap-4 transition-all
        ${selectedFiles.includes(file.id) ? 'border-[#FDB813] bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={() => toggleFileSelection(file.id)}
    >
      <div className="p-2 bg-gray-100 rounded-lg">
        {getFileIcon(file.mimeType)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#222] truncate">{file.name}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{formatFileSize(file.size)}</span>
          <span>•</span>
          <span>{file.uploadedBy.name}</span>
          <span>•</span>
          <span>{format(new Date(file.uploadedAt), 'MMM dd, yyyy')}</span>
        </div>
      </div>
      
      <Badge variant={categories.find(c => c.key === file.category)?.color as any}>
        {categories.find(c => c.key === file.category)?.label}
      </Badge>
      
      <div className="flex gap-2">
        <Button size="sm" variant="ghost">
          <Eye size={16} />
        </Button>
        <Button size="sm" variant="ghost">
          <Download size={16} />
        </Button>
        <Button size="sm" variant="ghost">
          <Share2 size={16} />
        </Button>
        {userRole === 'client' && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-500 hover:text-red-700"
            onClick={() => fileDelete.mutate({ projectId, fileId: file.id })}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#222]">Project Files</h2>
          <p className="text-gray-600 mt-1">
            {filteredFiles.length} files • {files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)} MB total
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-[#FDB813] text-[#222]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-[#FDB813] text-[#222]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={16} />
            </button>
          </div>
          
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload size={16} className="mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
            />
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedFiles.length} selected
              </span>
              <Button size="sm" variant="outline">
                <Download size={14} className="mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline" className="text-red-500">
                <Trash2 size={14} className="mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-[#FDB813] text-[#222]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
              <span className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
                {category.key === 'all' 
                  ? files.length 
                  : files.filter(f => f.category === category.key).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Files Display */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-[#222] mb-2">No files found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Upload your first file to get started'}
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload size={16} className="mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFiles.map((file) => (
                  <FileListItem key={file.id} file={file} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && <FileUploadModal />}
      </AnimatePresence>
    </div>
  );
};

export default FileManager;