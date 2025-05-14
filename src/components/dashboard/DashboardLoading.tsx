import React from 'react';
import { ProjectCardSkeleton, StatsSkeleton, TableRowSkeleton } from '@/components/ui/Skeleton';

const DashboardLoading = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <StatsSkeleton key={i} />
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-48 bg-gray-100 rounded-md animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
