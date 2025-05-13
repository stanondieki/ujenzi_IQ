// src/components/dashboard/AlertPanel.tsx
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistance } from 'date-fns';
import firebase from 'firebase/compat/app';

interface Alert {
  id: string;
  siteCode: string;
  statusType: string;
  message: string;
  from: string;
  timestamp: import('firebase/firestore').Timestamp;
  projectName?: string;
}

const AlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  
  useEffect(() => {
    if (!userData) return;
    
    let alertsQuery;
    
    // Different queries based on user role
    if (userData.role === 'admin') {
      alertsQuery = query(
        collection(db, 'alerts'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
    } else {
      // For supervisors and stakeholders, only show alerts for their projects
      // This requires you to store projectIds in the user document
      alertsQuery = query(
        collection(db, 'alerts'),
        where('projectIds', 'array-contains', userData.uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
    }
    
    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const alertsData: Alert[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Alert));
      
      setAlerts(alertsData);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [userData]);
  
  // Determine status color
  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'DELAY':
        return 'bg-amber-100 text-amber-800 border-l-4 border-amber-500';
      case 'INCIDENT':
        return 'bg-red-100 text-red-800 border-l-4 border-red-500';
      case 'DONE':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';
      case 'STARTED':
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
      default:
        return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';
    }
  };
  
  // Format the timestamp
  const getFormattedTime = (timestamp: firebase.firestore.Timestamp | Date) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp instanceof firebase.firestore.Timestamp ? timestamp.toDate() : new Date(timestamp);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch {
      return '';
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Recent Alerts</h3>
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Recent Alerts</h3>
      
      {alerts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No alerts yet</p>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-3 rounded-md ${getStatusColor(alert.statusType)}`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{alert.siteCode} - {alert.projectName}</span>
                <span className="text-xs">{getFormattedTime(alert.timestamp)}</span>
              </div>
              <p className="mt-1 text-sm">{alert.statusType}: {alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertPanel;