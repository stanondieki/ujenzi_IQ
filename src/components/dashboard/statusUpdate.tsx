import React from 'react';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Update {
  id: string;
  message: string;
  timestamp: Date;
  type: 'milestone' | 'update' | 'completion';
}

interface StatusUpdatesProps {
  updates: Update[];
}

const StatusUpdates: React.FC<StatusUpdatesProps> = ({ updates }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Updates</h2>
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="flex items-start space-x-3">
            {update.type === 'completion' ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ClockIcon className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <p className="text-sm text-gray-900">{update.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(update.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusUpdates;