// src/components/dashboard/ProjectList.tsx
import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import ProjectCard from './projectCard';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  siteCode: string;
  status: string;
  location: string;
  lastUpdate: Date;
  lastMessage: string;
  progress: number;
}

// Add props interface
interface ProjectListProps {
  projects?: Project[];
  loading?: boolean;
}

// Update component to use props interface
const ProjectList: React.FC<ProjectListProps> = ({ projects: externalProjects, loading: externalLoading }) => {
  const [projects, setProjects] = useState<Project[]>(externalProjects || []);
  const [loading, setLoading] = useState<boolean>(externalLoading || true);
  const { userData } = useAuth();
  
  useEffect(() => {
    // Only fetch from Firestore if no external projects are provided
    if (externalProjects || !userData) return;
    
    let projectsQuery;
    
    // Different queries based on user role
    if (userData.role === 'admin') {
      projectsQuery = query(collection(db, 'projects'));
    } else if (userData.role === 'supervisor') {
      projectsQuery = query(
        collection(db, 'projects'),
        where('supervisors', 'array-contains', userData.uid)
      );
    } else {
      projectsQuery = query(
        collection(db, 'projects'),
        where('stakeholders', 'array-contains', userData.uid)
      );
    }
    
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData: Project[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      
      setProjects(projectsData);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [userData, externalProjects]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        
        {userData?.role === 'admin' && (
          <Link href="/projects/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Add New Project
          </Link>
        )}
      </div>
      
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No projects found.</p>
          {userData?.role === 'admin' && (
            <Link href="/projects/new" className="text-blue-500 hover:text-blue-700 mt-2 inline-block">
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;