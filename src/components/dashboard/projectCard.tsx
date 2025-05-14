import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ProjectCardSkeleton } from '../ui/Skeleton';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Hash, 
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';

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
  isLoading?: boolean;
  index?: number;
}

const ProjectCard: React.FC<ProjectProps> = ({ project, isLoading, index = 0 }) => {
  if (isLoading) {
    return <ProjectCardSkeleton />;
  }

  // Determine status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'DELAY':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: AlertTriangle,
          iconClass: 'text-amber-500'
        };
      case 'INCIDENT':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          iconClass: 'text-red-500'
        };
      case 'DONE':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle2,
          iconClass: 'text-green-500'
        };
      case 'STARTED':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Loader2,
          iconClass: 'text-blue-500'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          iconClass: 'text-gray-500'
        };
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

  const statusInfo = getStatusInfo(project.status);
  const StatusIcon = statusInfo.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.id}`}>
        <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-1 text-gray-400" />
                    {project.siteCode}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {project.location}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${statusInfo.color}`}>
                <StatusIcon className={`h-3.5 w-3.5 mr-1 ${statusInfo.iconClass}`} />
                {project.status || 'PENDING'}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{project.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-blue-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress || 0}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                <span className="flex-1">Last update {getFormattedTime(project.lastUpdate)}</span>
              </div>
              {project.lastMessage && (                <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                  &ldquo;{project.lastMessage}&rdquo;
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-end mt-2 text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;