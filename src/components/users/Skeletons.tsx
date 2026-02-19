import React from 'react';

export const UsersListSkeleton: React.FC = () => {
    return (
        <div className="space-y-4">
            {/* Simulate multiple user rows */}
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse flex items-center space-x-4">
                    <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};