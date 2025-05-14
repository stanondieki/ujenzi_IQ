import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';

interface CreateAlertProps {
  isOpen: boolean;
  onClose: () => void;
  projectSiteCode?: string;
  onSuccess?: () => void;
}

const MESSAGE_TEMPLATES = {
  DELAY: [
    "DELAY: {hours}hr delay at {site}. Cause: {reason}. New ETA: {time}",
    "PROGRESS: {site} delayed by {hours}hrs due to {reason}. {impact} affected.",
  ],
  INCIDENT: [
    "INCIDENT: {type} at {site}. Status: {status}. Action: {action}",
    "URGENT: {severity} incident at {site}. {details}. Response team: {team}",
  ]
};

const SMS_MAX_LENGTH = 160;

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
  const [error, setError] = useState('');  const [projects, setProjects] = useState<{id: string, siteCode: string, name: string}[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Fetch projects if needed
  useEffect(() => {
    const fetchProjects = async () => {
      if (!isOpen || projectSiteCode || projects.length > 0) return;
      
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
    
    fetchProjects();
  }, [isOpen, projectSiteCode, projects.length]);

  const getSelectedProject = () => {
    return projects.find(p => p.siteCode === siteCode);
  };

  const handleTemplateSelect = (template: string) => {
    setMessage(template);
  };

  const validateSMSFormat = (text: string): boolean => {
    if (text.length > SMS_MAX_LENGTH) {
      setError(`Message exceeds ${SMS_MAX_LENGTH} characters (current: ${text.length})`);
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteCode || !message) {
      setError('Please fill all required fields');
      return;
    }

    if (!validateSMSFormat(message)) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const selectedProject = getSelectedProject();
      
      // Create the alert document in Firestore
      const alertRef = await addDoc(collection(db, 'alerts'), {
        siteCode,
        projectName: selectedProject?.name,
        statusType,
        message,
        timestamp: serverTimestamp(),
        createdBy: userData?.uid,
        creatorRole: userData?.role,
        smsStatus: 'pending'
      });

      // Trigger SMS sending cloud function
      // The actual sending is handled by the backend to keep API keys secure
      await addDoc(collection(db, 'sms_queue'), {
        alertId: alertRef.id,
        message,
        siteCode,
        statusType,
        timestamp: serverTimestamp()
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
  
  const getCharacterCount = () => {
    return `${message.length}/${SMS_MAX_LENGTH}`;
  };
  const copyTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
  };

  // Early returns should be at the start of render
  if (!isOpen) return null;
  
  // If not admin or supervisor, they shouldn't be able to use this component
  if (userData?.role !== 'admin' && userData?.role !== 'supervisor') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-bold flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Create New Site Alert
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
              Project Site*
            </label>
            {projectSiteCode ? (
              <input 
                type="text" 
                id="siteCode"
                value={projectSiteCode}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            ) : (              <select
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
                  checked={statusType === 'DELAY'}                  onChange={() => {
                    setStatusType('DELAY');
                    setMessage('');
                  }}
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
                  checked={statusType === 'INCIDENT'}                  onChange={() => {
                    setStatusType('INCIDENT');
                    setMessage('');
                  }}
                  className="hidden"
                />
                <span className="w-3 h-3 inline-block rounded-full bg-red-500 mr-2"></span>
                <span className="font-medium text-red-800">Incident</span>
              </label>
            </div>
          </div>

          {/* Message Templates */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Message Templates
            </label>
            <div className="space-y-2">
              {MESSAGE_TEMPLATES[statusType as keyof typeof MESSAGE_TEMPLATES].map((template, index) => (
                <div key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <p className="text-sm text-gray-600">{template}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyTemplate(template);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ClipboardIcon className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Alert Message* <span className="text-sm text-gray-500">({getCharacterCount()})</span>
            </label>
            <div className="relative">
              <textarea
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  validateSMSFormat(e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] ${
                  message.length > SMS_MAX_LENGTH ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Replace the {placeholders} in the template or write your message..."
                required
              />
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded text-gray-500"
                title="Toggle SMS Preview"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
              </button>
            </div>
            {previewMode && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700">SMS Preview:</p>
                <p className="text-sm text-gray-600 mt-1">{message}</p>
              </div>
            )}
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
              disabled={loading || message.length > SMS_MAX_LENGTH}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              )}
              Send Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlert;