# LancerScape - India's Premier Freelancing Platform

<div align="center">
  <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop" alt="LancerScape Banner" width="100%" height="200" style="object-fit: cover; border-radius: 10px;">
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 🚀 Overview

LancerScape is a modern, feature-rich freelancing platform specifically designed for the Indian market. Built with cutting-edge technologies, it provides a seamless experience for both clients and freelancers to connect, collaborate, and complete projects efficiently.

### 🎯 Key Highlights

- **🇮🇳 India-Focused**: Designed specifically for Indian freelancers and clients
- **💰 INR Currency**: All transactions and budgets in Indian Rupees
- **🌐 Bilingual Support**: Hindi and English language support
- **📱 Mobile-First**: Responsive design optimized for all devices
- **⚡ Real-Time**: Live updates and notifications via WebSocket
- **🎨 Modern UI**: Beautiful, intuitive interface with smooth animations

## ✨ Features

### 🔍 **Project Management**
- **Project Browser**: Advanced search and filtering system
- **Smart Filters**: Filter by budget, skills, location, client rating
- **Project Categories**: Web development, mobile apps, design, content writing, and more
- **Detailed Project Views**: Comprehensive project information with attachments

### 📊 **Milestone Management Dashboard**
- **Kanban Board**: Drag-and-drop milestone tracking
- **Progress Visualization**: Real-time progress bars and completion tracking
- **Budget Breakdown**: Detailed financial tracking per milestone
- **Deadline Management**: Overdue detection and alerts
- **Status Updates**: Easy milestone status changes

### 📁 **File Management System**
- **Drag-and-Drop Upload**: Modern file upload interface
- **File Categorization**: Organize by Requirements, Deliverables, References
- **Multiple View Modes**: Grid and list views
- **Bulk Operations**: Select and manage multiple files
- **File Preview**: Support for images, documents, videos
- **Storage Analytics**: Track file usage and storage

### 🔔 **Real-Time Notifications**
- **Notification Center**: Comprehensive notification management
- **Live Updates**: Instant notifications via WebSocket
- **Priority Levels**: High, medium, low priority notifications
- **Smart Filtering**: Filter by type, read/unread status
- **Action Integration**: Click to navigate to relevant content

### 💼 **Proposal System**
- **Multi-Step Proposal Form**: Guided proposal submission
- **Milestone Planning**: Break projects into manageable phases
- **Budget Calculator**: Smart budget distribution across milestones
- **Cover Letter Templates**: Professional proposal formatting
- **Proposal Tracking**: Monitor proposal status and responses

### 👥 **User Management**
- **Dual User Types**: Freelancer and Client interfaces
- **Profile Management**: Comprehensive user profiles
- **Rating System**: Client and freelancer rating system
- **Portfolio Integration**: Showcase previous work

### 🔄 **Real-Time Features**
- **WebSocket Integration**: Live updates across the platform
- **Connection Management**: Auto-reconnection with fallback
- **Status Indicators**: Real-time connection status
- **Live Collaboration**: Real-time project updates

## 🛠 Technology Stack

### **Frontend**
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.2** - Lightning-fast build tool
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### **State Management & Data**
- **TanStack React Query 5.85.5** - Server state management
- **React Hook Form 7.62.0** - Form handling and validation
- **Zod 4.0.17** - Schema validation

### **UI & Animations**
- **Framer Motion 12.23.12** - Smooth animations and transitions
- **Lucide React 0.344.0** - Beautiful icon library
- **React DnD 16.0.1** - Drag and drop functionality

### **Utilities**
- **Axios 1.11.0** - HTTP client
- **Date-fns 4.1.0** - Date manipulation
- **React Router DOM 7.8.1** - Client-side routing

## 📦 Installation

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/lancerscape-project-management.git
   cd lancerscape-project-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   VITE_REACT_APP_API_URL=https://api.lancerscape.in
   VITE_WS_URL=wss://api.lancerscape.in
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel
1. Import project from GitHub
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server for SPA routing

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_REACT_APP_API_URL` | Backend API URL | Yes |
| `VITE_WS_URL` | WebSocket server URL | No |
| `VITE_SUPABASE_URL` | Supabase project URL | No |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | No |

### API Integration

The platform is designed to work with a RESTful API. Key endpoints:

- `GET /projects` - Fetch projects
- `POST /projects/create` - Create new project
- `GET /projects/:id/details` - Get project details
- `POST /proposals/submit` - Submit proposal
- `GET /notifications` - Fetch notifications

## 📱 Usage Guide

### For Clients

1. **Post a Project**
   - Click "Post Project" in navigation
   - Fill out the multi-step project creation wizard
   - Set budget, deadline, and required skills
   - Add project attachments if needed

2. **Manage Projects**
   - View all your projects in "My Projects"
   - Track proposals received
   - Manage project milestones
   - Handle file uploads and deliverables

3. **Review Proposals**
   - Browse received proposals
   - Compare freelancer profiles and rates
   - Accept or reject proposals
   - Communicate with freelancers

### For Freelancers

1. **Browse Projects**
   - Use advanced filters to find relevant projects
   - Search by skills, budget, and location
   - View detailed project requirements

2. **Submit Proposals**
   - Write compelling cover letters
   - Set competitive pricing
   - Break work into milestones
   - Track proposal status

3. **Manage Work**
   - Update milestone progress
   - Upload deliverables
   - Communicate with clients
   - Track earnings

## 🎨 Design System

### Color Palette
- **Primary**: `#FDB813` (Golden Yellow)
- **Secondary**: `#FF9800` (Orange)
- **Background**: `#F5F5F5` (Light Gray)
- **Text**: `#222222` (Dark Gray)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)

### Typography
- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Line Height**: 1.5 for body, 1.2 for headings

### Spacing
- **Base Unit**: 8px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## 🧪 Testing

### Run Tests
```bash
npm run test
# or
yarn test
```

### Test Coverage
```bash
npm run test:coverage
# or
yarn test:coverage
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Write comprehensive tests for new features
- Follow the existing code style and formatting
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Lucide** - For beautiful icons
- **Indian Freelancing Community** - For inspiration and feedback

## 📞 Support

- **Documentation**: [docs.lancerscape.in](https://docs.lancerscape.in)
- **Email**: support@lancerscape.in
- **GitHub Issues**: [Create an issue](https://github.com/your-username/lancerscape-project-management/issues)
- **Discord**: [Join our community](https://discord.gg/lancerscape)

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Project management system
- ✅ Milestone tracking
- ✅ File management
- ✅ Real-time notifications

### Phase 2 (Upcoming)
- 🔄 Payment integration (Razorpay)
- 🔄 Video calling system
- 🔄 Advanced analytics
- 🔄 Mobile app (React Native)

### Phase 3 (Future)
- 📅 AI-powered project matching
- 📅 Blockchain-based payments
- 📅 Advanced reporting
- 📅 Multi-language support

---

<div align="center">
  <p>Made with ❤️ for the Indian Freelancing Community</p>
  <p>
    <a href="https://lancerscape.in">Website</a> •
    <a href="https://docs.lancerscape.in">Documentation</a> •
    <a href="https://github.com/your-username/lancerscape-project-management">GitHub</a>
  </p>
</div>