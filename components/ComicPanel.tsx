
import React from 'react';

interface ComicPanelProps {
  title?: string;
  children: React.ReactNode;
  color?: string;
  className?: string;
  rotation?: string;
}

const ComicPanel: React.FC<ComicPanelProps> = ({ 
  title, 
  children, 
  color = 'bg-white', 
  className = '',
  rotation = 'rotate-0'
}) => {
  return (
    <div className={`comic-border ${color} p-6 relative overflow-hidden transform ${rotation} ${className}`}>
      <div className="halftone absolute inset-0 pointer-events-none"></div>
      {title && (
        <div className="absolute -top-2 -left-2 bg-black text-white px-4 py-1 comic-text text-xl transform -rotate-3 z-10 border-2 border-white">
          {title}
        </div>
      )}
      <div className="relative z-0 mt-4">
        {children}
      </div>
    </div>
  );
};

export default ComicPanel;
