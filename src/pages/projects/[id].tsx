// src/pages/projects/[id].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/Layout/dashboard';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Project {
  id: string;
  name: string;
  siteCode: string;
  status: string;
  location: string;
  description: string;
  progress: number;
  lastUpdate: unknown;
  lastMessage: string;
  createdAt: unknown;
  supervisors: string[];
  stakeholders: string[];
}

interface Alert {
  id: string;
  siteCode: string;
  statusType: string;
  message: string;
  from: string;
  timestamp: Timestamp | Date;
}

const ProjectDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userData } = useAuth();
  
  useEffect(() => {
    if (!id) return;
    
    // Get project details
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', id as string));
        
        if (projectDoc.exists()) {
          setProject({
            id: projectDoc.id,
            ...projectDoc.data()
          } as Project);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Error loading project details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
    
    // Get project alerts with real-time updates
    const alertsQuery = query(
      collection(db, 'alerts'),
      where('siteCode', '==', project?.siteCode || ''),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const alertsData: Alert[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Alert));
      
      setAlerts(alertsData);
    });
    
    return () => unsubscribe();
  }, [id, project?.siteCode]);
  
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
  const getFormattedTime = (timestamp: Timestamp | Date | null | undefined) => {
    if (!timestamp) return 'No updates yet';
    
    try {
      const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Project not found'}
        </div>
        <div className="mt-4">
          <Link href="/projects" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link href="/projects" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Projects
          </Link>
          <h1 className="text-3xl font-bold mt-2">{project.name}</h1>
        </div>
        
        {userData?.role === 'admin' && (
          <Link 
            href={`/projects/${project.id}/edit`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Edit Project
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">Project Details</h2>
                <p className="text-gray-500 text-sm">Created {getFormattedTime(project.createdAt as Timestamp | Date | null | undefined)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status || 'PENDING'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Site Code:</span> {project.siteCode}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Location:</span> {project.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Last Update:</span> {getFormattedTime(project.lastUpdate as Timestamp | Date | null | undefined)}
                </p>
                {project.lastMessage && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Last Message:</span> &quot;{project.lastMessage}&quot;
                  </p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
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
            
            {project.description && (
              <div>
                <h3 className="text-md font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            )}
          </div>
          
          {/* SMS Instructions */}
          {userData?.role === 'supervisor' && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">SMS Update Instructions</h2>
              <p className="mb-3">Send SMS updates using the following formats:</p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-semibold mb-2">Format Examples:</h3>
                <p className="font-mono text-sm mb-1">{project.siteCode} STARTED Foundation work</p>
                <p className="font-mono text-sm mb-1">{project.siteCode} DELAY Material shortage</p>
                <p className="font-mono text-sm mb-1">{project.siteCode} DONE Electrical wiring</p>
                <p className="font-mono text-sm">{project.siteCode} INCIDENT Worker injury</p>
              </div>
              
              <p className="text-sm text-gray-600">
                Send SMS to: <span className="font-mono">[Your Africa&apos;s Talking Phone Number]</span>
              </p>
            </div>
          )}
        </div>
        
        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
            
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <span className={`text-sm font-medium ${getStatusColor(alert.statusType)}`}>
                        {alert.statusType}
                      </span>
                      <span className="text-xs text-gray-500">{getFormattedTime(alert.timestamp)}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Stakeholder Management - For Admin Only */}
          {userData?.role === 'admin' && (
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Stakeholders</h2>
              
              <Link 
                href={`/projects/${project.id}/stakeholders`}
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center px-4 py-2 rounded-md"
              >
                Manage Stakeholders
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;