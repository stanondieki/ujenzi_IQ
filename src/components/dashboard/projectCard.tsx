// src/components/dashboard/ProjectCard.tsx
import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface ProjectProps {
  project: {
    id: string;
    name: string;
    siteCode: string;
    status: string;
    location: string;
    lastUpdate: Date | { toDate: () => Date } | null;
    lastMessage: string;
    progress: number;
  };
}

const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELAY':
        return 'bg-amber-100 text-amber-800';
      case 'INCIDENT':
        return 'bg-red-100 text-red-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      case 'STARTED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format the timestamp
  const getFormattedTime = (timestamp: Date | { toDate: () => Date } | null) => {
    if (!timestamp) return 'No updates yet';
    
    try {
      const date = typeof timestamp === 'object' && 'toDate' in timestamp ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };
  
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status || 'PENDING'}
            </span>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Site Code:</span> {project.siteCode}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Location:</span> {project.location}
            </p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{project.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${project.progress || 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Last Update:</span> {getFormattedTime(project.lastUpdate)}
            </p>
            {project.lastMessage && (
              <p className="text-sm text-gray-600 mt-1 truncate">
                &quot;{project.lastMessage}&quot;
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;