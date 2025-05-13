import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '@/components/Layout/dashboard';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  DocumentTextIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import CreateAlert from '@/components/dashboard/CreateAlert';

interface Project {
  id: string;
  name: string;
  siteCode: string;
  status: string;
  progress: number;
  lastUpdate: Date;
}

interface Alert {
  id: string;
  siteCode: string;
  statusType: string;
  message: string;
  timestamp: Timestamp;
}

const DashboardPage = () => {
  const [projectStats, setProjectStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    delayed: 0
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);

  // Check if user can create alerts (admin or supervisor)
  const canCreateAlerts = userData?.role === 'admin' || userData?.role === 'supervisor';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch projects statistics
        const projectsQuery = query(collection(db, 'projects'));
        const projectsSnapshot = await getDocs(projectsQuery);
        
        let total = 0;
        let inProgress = 0;
        let completed = 0;
        let delayed = 0;
        
        projectsSnapshot.forEach((doc) => {
          total++;
          const status = doc.data().status;
          if (status === 'DONE') completed++;
          else if (status === 'DELAY') delayed++;
          else if (status === 'STARTED') inProgress++;
        });
        
        setProjectStats({
          total,
          inProgress,
          completed,
          delayed
        });
        
        // Fetch recent projects
        const recentProjectsQuery = query(collection(db, 'projects'), orderBy('lastUpdate', 'desc'), limit(5));
        const recentProjectsSnapshot = await getDocs(recentProjectsQuery);
        
        const recentProjectsData = recentProjectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        
        setRecentProjects(recentProjectsData);
        
        // Fetch recent alerts
        let alertsQuery;
        if (userData?.role === 'admin' || userData?.role === 'supervisor') {
          // Admins and supervisors see all alerts
          alertsQuery = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(5));
        } else if (userData?.projects) {
          // Stakeholders only see alerts for their projects
          alertsQuery = query(
            collection(db, 'alerts'), 
            where('siteCode', 'in', userData.projects),
            orderBy('timestamp', 'desc'), 
            limit(5)
          );
        } else {
          // Default for users with no projects
          alertsQuery = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(5));
        }
        
        const alertsSnapshot = await getDocs(alertsQuery);
        
        const alertsData = alertsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Alert));
        
        setRecentAlerts(alertsData);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData]);

  // Refresh alerts after creating a new one
  const handleAlertCreated = async () => {
    setLoading(true);
    try {
      // Fetch only alerts to refresh the list
      let alertsQuery;
      if (userData?.role === 'admin' || userData?.role === 'supervisor') {
        alertsQuery = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(5));
      } else if (userData?.projects) {
        alertsQuery = query(
          collection(db, 'alerts'), 
          where('siteCode', 'in', userData.projects),
          orderBy('timestamp', 'desc'), 
          limit(5)
        );
      } else {
        alertsQuery = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(5));
      }
      
      const alertsSnapshot = await getDocs(alertsQuery);
      
      const alertsData = alertsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Alert));
      
      setRecentAlerts(alertsData);
    } catch (err) {
      console.error('Error refreshing alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format the timestamp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No date';
    try {
      const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return 'Invalid date';
    }
  };

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

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2 font-medium">
          Welcome back{userData?.displayName ? `, ${userData.displayName}` : ''}! Here&apos;s your project overview.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-blue-100 p-3">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-800">{projectStats.total}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium mt-4">Total Projects</p>
              <div className="mt-2 h-1 w-full bg-blue-100 rounded-full">
                <div className="h-1 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-indigo-100 p-3">
                  <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-3xl font-bold text-gray-800">{projectStats.inProgress}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium mt-4">In Progress</p>
              <div className="mt-2 h-1 w-full bg-indigo-100 rounded-full">
                <div className="h-1 bg-indigo-500 rounded-full" style={{ width: `${projectStats.inProgress / projectStats.total * 100}%` }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-800">{projectStats.completed}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium mt-4">Completed</p>
              <div className="mt-2 h-1 w-full bg-green-100 rounded-full">
                <div className="h-1 bg-green-500 rounded-full" style={{ width: `${projectStats.completed / projectStats.total * 100}%` }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-amber-100 p-3">
                  <BellAlertIcon className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-3xl font-bold text-gray-800">{projectStats.delayed}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium mt-4">Delayed</p>
              <div className="mt-2 h-1 w-full bg-amber-100 rounded-full">
                <div className="h-1 bg-amber-500 rounded-full" style={{ width: `${projectStats.delayed / projectStats.total * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Recent Projects</h2>
                </div>
                <Link href="/projects" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  View All Projects
                </Link>
              </div>
              
              {recentProjects.length === 0 ? (
                <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="font-medium">No projects found</p>
                  <p className="text-sm mt-1">Add your first project to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <Link 
                      href={`/projects/${project.id}`} 
                      key={project.id}
                      className="block p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{project.name}</h3>
                          <div className="flex items-center text-gray-500 mt-1">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <p className="text-sm">Code: {project.siteCode}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs font-semibold text-gray-700">Progress</span>
                          <span className="text-xs font-semibold text-gray-700">{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${
                              project.progress >= 80 ? 'bg-green-500' : 
                              project.progress >= 40 ? 'bg-blue-500' : 
                              'bg-amber-500'
                            }`}
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recent Alerts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BellAlertIcon className="h-5 w-5 text-amber-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Recent Alerts</h2>
                </div>
                
                {/* Create Alert Button - Only visible to admins and supervisors */}
                {canCreateAlerts && (
                  <button 
                    onClick={() => setIsCreateAlertOpen(true)}
                    className="flex items-center bg-amber-100 text-amber-800 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    New Alert
                  </button>
                )}
              </div>
              
              {recentAlerts.length === 0 ? (
                <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <BellAlertIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="font-medium">No alerts found</p>
                  <p className="text-sm mt-1">You&apos;re all caught up!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className={`border-l-4 ${
                      alert.statusType === 'INCIDENT' ? 'border-red-500' :
                      alert.statusType === 'DELAY' ? 'border-amber-500' :
                      'border-blue-500'
                    } pl-4 py-3 bg-gray-50 rounded-r-lg hover:shadow-sm transition-shadow`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium flex items-center gap-1 ${getStatusColor(alert.statusType)} px-2 py-0.5 rounded`}>
                          {getStatusIcon(alert.statusType)}
                          {alert.statusType}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatDate(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium mt-2">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <DocumentTextIcon className="h-3 w-3 mr-1" />
                        Site: {alert.siteCode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create Alert Modal */}
          <CreateAlert 
            isOpen={isCreateAlertOpen} 
            onClose={() => setIsCreateAlertOpen(false)} 
            onSuccess={handleAlertCreated}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;