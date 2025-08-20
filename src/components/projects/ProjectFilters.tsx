import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { ProjectFilters as IProjectFilters } from '../../types/project';
import Button from '../common/Button';

interface ProjectFiltersProps {
  filters: IProjectFilters;
  onFiltersChange: (filters: IProjectFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle
}) => {
  const categories = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Digital Marketing',
    'Content Writing',
    'Data Entry',
    'Graphic Design',
    'SEO Services',
    'Social Media Management',
    'Translation (Hindi/English)',
    'Video Editing',
    'E-commerce Development'
  ];

  const skills = [
    'React',
    'Node.js',
    'Python',
    'JavaScript',
    'PHP',
    'WordPress',
    'Shopify',
    'Flutter',
    'React Native',
    'Angular',
    'Laravel',
    'MongoDB',
    'MySQL',
    'Figma',
    'Photoshop',
    'Adobe Illustrator',
    'Content Writing',
    'SEO',
    'Google Ads',
    'Facebook Ads',
    'Hindi Translation',
    'Data Entry',
    'Excel',
    'Tally'
  ];

  const handleFilterChange = (key: keyof IProjectFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    handleFilterChange('skills', newSkills);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    handleFilterChange('categories', newCategories);
  };

  const clearFilters = () => {
    onFiltersChange({
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
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813] focus:border-transparent"
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            onClick={onToggle}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Advanced Filters
          </Button>
          <Button variant="ghost" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0, 
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 space-y-6">
          {/* Budget Range */}
          <div>
            <h4 className="font-semibold text-[#222] mb-3">Budget Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Budget (₹)</label>
                <input
                  type="number"
                  value={filters.budget_min}
                  onChange={(e) => handleFilterChange('budget_min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Budget (₹)</label>
                <input
                  type="number"
                  value={filters.budget_max}
                  onChange={(e) => handleFilterChange('budget_max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
                />
              </div>
            </div>
          </div>

          {/* Project Type */}
          <div>
            <h4 className="font-semibold text-[#222] mb-3">Project Type</h4>
            <select
              value={filters.project_type}
              onChange={(e) => handleFilterChange('project_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
            >
              <option value="all">All Types</option>
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-[#222] mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.categories.includes(category)
                      ? 'bg-[#FDB813] text-[#222]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-semibold text-[#222] mb-3">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.skills.includes(skill)
                      ? 'bg-[#FF9800] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h4 className="font-semibold text-[#222] mb-3">Sort By</h4>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FDB813]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget_high">Highest Budget</option>
              <option value="budget_low">Lowest Budget</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectFilters;