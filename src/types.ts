export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user' | 'stakeholder';
    name: string;
    phoneNumber?: string;
    projects?: string[];
  }
  
  export interface Project {
    id: string;
  name: string;
  title?: string;
  siteCode: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  location: string;
  lastUpdate: Date;
  lastMessage: string;
  progress: number;
  description?: string;
  budget?: number;
  stakeholders?: string[];
  supervisors?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  }
  
  export interface Alert {
    id: string;
    projectId: string;
    type: 'warning' | 'danger' | 'info';
    message: string;
    createdAt: Date;
    isRead: boolean;
  }
  
  export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    email: string;
    phoneNumber: string;
    projects: string[];
  }