import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Project } from '../types';
import { useAuth } from './useAuth';

export const useProjects = (userId?: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let projectsQuery = query(
          collection(db, 'projects'),
          orderBy('createdAt', 'desc')
        );

        // If userId is provided or user is not admin, filter by stakeholder
        if (userId || userData?.role !== 'admin') {
          projectsQuery = query(
            collection(db, 'projects'),
            where('stakeholders', 'array-contains', userId || currentUser?.uid),
            orderBy('createdAt', 'desc')
          );
        }

        const querySnapshot = await getDocs(projectsQuery);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];

        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser, userId, userData?.role]);

  const getProject = async (projectId: string) => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        return { id: projectDoc.id, ...projectDoc.data() } as Project;
      }
      return null;
    } catch (err) {
      console.error('Error fetching project:', err);
      throw new Error('Failed to fetch project');
    }
  };

  return {
    projects,
    loading,
    error,
    getProject,
    refreshProjects: () => {
      setLoading(true);
      setProjects([]);
    }
  };
};

export default useProjects;