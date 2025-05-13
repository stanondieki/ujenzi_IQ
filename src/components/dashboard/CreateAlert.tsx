import React, { useState } from 'react';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface CreateAlertProps {
  isOpen: boolean;
  onClose: () => void;
  projectSiteCode?: string; // Optional: For pre-selecting a project
  onSuccess?: () => void; // Optional: Callback after successful creation
}

const CreateAlert: React.FC<CreateAlertProps> = ({ 
  isOpen, 
  onClose, 
  projectSiteCode,
  onSuccess
}) => {
  const { userData } = useAuth();
  const [siteCode, setSiteCode] = useState(projectSiteCode || '');
  const [statusType, setStatusType] = useState('DELAY');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<{id: string, siteCode: string, name: string}[]>([]);
  
  // If not admin or supervisor, they shouldn't be able to use this component
  if (userData?.role !== 'admin' && userData?.role !== 'supervisor') {
    return null;
  }
  
  // Fetch projects if needed (implement this)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects');
        const projectsSnapshot = await getDocs(projectsRef);
        const projectsList = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          siteCode: doc.data().siteCode,
          name: doc.data().name
        }));
        
        setProjects(projectsList);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
      }
    };
    
    if (isOpen && !projectSiteCode && projects.length === 0) {
      fetchProjects();
    }
  }, [isOpen, projectSiteCode, projects.length]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteCode || !message) {
      setError('Please fill all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create the alert document in Firestore
      await addDoc(collection(db, 'alerts'), {
        siteCode,
        statusType,
        message,
        timestamp: serverTimestamp(),
        createdBy: userData?.uid,
        creatorRole: userData?.role
      });
      
      // Reset form
      if (!projectSiteCode) setSiteCode('');
      setMessage('');
      setStatusType('DELAY');
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
      // Close the modal
      onClose();
      
    } catch (err) {
      console.error('Error creating alert:', err);
      setError('Failed to create alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-bold flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Create New Alert
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-1"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          {/* Site Code Selector */}
          <div className="mb-4">
            <label htmlFor="siteCode" className="block text-gray-700 font-medium mb-2">
              Project Site Code*
            </label>
            {projectSiteCode ? (
              <input 
                type="text" 
                id="siteCode"
                value={projectSiteCode}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            ) : (
              <select
                id="siteCode"
                value={siteCode}
                onChange={(e) => setSiteCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.siteCode}>
                    {project.name} ({project.siteCode})
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {/* Status Type */}
          <div className="mb-4">
            <label htmlFor="statusType" className="block text-gray-700 font-medium mb-2">
              Alert Type*
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                statusType === 'DELAY' ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200' : 'border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="statusType"
                  value="DELAY"
                  checked={statusType === 'DELAY'}
                  onChange={() => setStatusType('DELAY')}
                  className="hidden"
                />
                <span className="w-3 h-3 inline-block rounded-full bg-amber-500 mr-2"></span>
                <span className="font-medium text-amber-800">Delay</span>
              </label>
              
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                statusType === 'INCIDENT' ? 'bg-red-50 border-red-500 ring-2 ring-red-200' : 'border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="statusType"
                  value="INCIDENT"
                  checked={statusType === 'INCIDENT'}
                  onChange={() => setStatusType('INCIDENT')}
                  className="hidden"
                />
                <span className="w-3 h-3 inline-block rounded-full bg-red-500 mr-2"></span>
                <span className="font-medium text-red-800">Incident</span>
              </label>
            </div>
          </div>
          
          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Alert Message*
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Describe the issue or alert details..."
              required
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              )}
              Create Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlert;