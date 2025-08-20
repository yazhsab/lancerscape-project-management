export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills_required: string[];
  project_type: 'fixed' | 'hourly';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  client: {
    id: string;
    name: string;
    rating: number;
    total_projects: number;
  };
  proposals_count: number;
  created_at: string;
  attachments: string[];
}

export interface Proposal {
  id: string;
  project_id: string;
  freelancer_id: string;
  cover_letter: string;
  proposed_budget: number;
  delivery_time: number;
  milestones: Milestone[];
  status: 'pending' | 'accepted' | 'rejected';
  submitted_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  deliverables: string[];
}

export interface ProjectFilters {
  search: string;
  categories: string[];
  budget_min: number;
  budget_max: number;
  duration: string;
  skills: string[];
  client_rating: number;
  project_type: string;
  sort: string;
}

export interface CreateProjectData {
  data: {
    type: "project";
    attributes: {
      title: string;
      description: string;
      budget: number;
      deadline: string;
      skills_required: string[];
      project_type: 'fixed' | 'hourly';
      attachments: string[];
    };
  };
}

export interface SubmitProposalData {
  data: {
    type: "proposal";
    attributes: {
      project_id: string;
      cover_letter: string;
      proposed_budget: number;
      delivery_time: number;
      milestones: Milestone[];
    };
  };
}