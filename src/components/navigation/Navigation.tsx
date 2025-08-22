import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Briefcase, 
  User, 
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';
import Button from '../common/Button';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userType: 'freelancer' | 'client';
  onUserTypeChange: (type: 'freelancer' | 'client') => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onViewChange,
  userType,
  onUserTypeChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { 
      id: 'browse', 
      label: 'Browse Projects', 
      icon: Search,
      available: ['freelancer', 'client']
    },
    { 
      id: 'my-projects', 
      label: 'My Projects', 
      icon: Briefcase,
      available: ['freelancer', 'client']
    },
    { 
      id: 'create', 
      label: 'Post Project', 
      icon: Plus,
      available: ['client']
    },
    { 
      id: 'milestones', 
      label: 'Milestones', 
      icon: Briefcase,
      available: ['freelancer', 'client']
    }
  ];

  const availableNavItems = navItems.filter(item => 
    item.available.includes(userType)
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-[#FDB813] rounded-lg flex items-center justify-center">
              <Briefcase className="text-[#222]" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#222]">LancerScape</h1>
              <p className="text-xs text-gray-600">India's Freelancing Platform</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {availableNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -1 }}
                  onClick={() => onViewChange(item.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
                    ${isActive 
                      ? 'text-[#FDB813] bg-yellow-50' 
                      : 'text-gray-600 hover:text-[#222] hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </motion.button>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* User Type Toggle */}
            <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onUserTypeChange('freelancer')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  userType === 'freelancer'
                    ? 'bg-white text-[#222] shadow-sm'
                    : 'text-gray-600 hover:text-[#222]'
                }`}
              >
                Freelancer
              </button>
              <button
                onClick={() => onUserTypeChange('client')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  userType === 'client'
                    ? 'bg-white text-[#222] shadow-sm'
                    : 'text-gray-600 hover:text-[#222]'
                }`}
              >
                Client
              </button>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-[#222] hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF9800] rounded-full"></div>
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-[#222] hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#FDB813] rounded-full flex items-center justify-center">
                <User size={16} className="text-[#222]" />
              </div>
              <span className="hidden md:block font-medium text-sm">John Doe</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-[#222] hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100"
          >
            <div className="py-4 space-y-2">
              {/* User Type Toggle Mobile */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  onClick={() => onUserTypeChange('freelancer')}
                  className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                    userType === 'freelancer'
                      ? 'bg-white text-[#222] shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Freelancer
                </button>
                <button
                  onClick={() => onUserTypeChange('client')}
                  className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                    userType === 'client'
                      ? 'bg-white text-[#222] shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Client
                </button>
              </div>

              {/* Navigation Items */}
              {availableNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left
                      ${isActive 
                        ? 'text-[#FDB813] bg-yellow-50' 
                        : 'text-gray-600 hover:text-[#222] hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;