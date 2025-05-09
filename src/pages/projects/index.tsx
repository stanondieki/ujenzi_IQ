import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/Layout/dashboard';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  MapPinIcon, 
  TagIcon, 
  PlusCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  siteCode: string;
  status: string;
  location: string;
  progress: number;
  lastUpdate: Date;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { userData } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsQuery = query(collection(db, 'projects'), orderBy('name'));
        const snapshot = await getDocs(projectsQuery);
        
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Determine status color based on status
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELAY':
        return <ClockIcon className="h-4 w-4" />;
      case 'INCIDENT':
        return <BellAlertIcon className="h-4 w-4" />;
      case 'DONE':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'STARTED':
        return <ArrowTrendingUpIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  // Get progress color based on percentage
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 40) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  // Filter projects based on search term and status filter
  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.siteCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(project => filterStatus === 'ALL' || project.status === filterStatus);

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          
          {userData?.role === 'admin' && (
            <Link 
              href="/projects/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center transition-colors shadow-sm"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Create Project
            </Link>
          )}
        </div>
        <p className="text-gray-600 mt-2 font-medium">
          Manage and monitor all your project activities
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search projects by name, code or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-shrink-0">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="STARTED">In Progress</option>
            <option value="DELAY">Delayed</option>
            <option value="DONE">Completed</option>
            <option value="INCIDENT">Incident</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BellAlertIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white shadow-md rounded-xl p-12 text-center">
          <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-medium text-gray-700 mb-4">No projects found</h2>
          <p className="text-gray-500 mb-6">Get started by creating your first project</p>
          {userData?.role === 'admin' && (
            <Link 
              href="/projects/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center text-lg font-medium transition-colors shadow-sm"
            >
              <PlusCircleIcon className="h-6 w-6 mr-2" />
              Create Your First Project
            </Link>
          )}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white shadow-md rounded-xl p-8 text-center">
          <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">No matching projects found</h2>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{project.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status || 'PENDING')}`}>
                      {getStatusIcon(project.status || 'PENDING')}
                      {project.status || 'PENDING'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <TagIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Site Code</p>
                        <p className="text-sm text-gray-800">{project.siteCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="text-sm text-gray-800">{project.location || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-gray-700">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${getProgressColor(project.progress || 0)}`} 
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-right">
                    <span className="inline-flex items-center text-xs text-blue-600 font-medium hover:text-blue-800">
                      View Details
                      <ArrowsPointingOutIcon className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && !error && projects.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;