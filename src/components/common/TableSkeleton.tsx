import React from 'react';

const TableSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-300 rounded w-1/4"></div>
      <div className="bg-white rounded-lg shadow">
        <div className="h-12 bg-gray-200 border-b"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between p-6 border-b">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;