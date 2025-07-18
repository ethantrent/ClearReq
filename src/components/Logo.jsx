import React from 'react';

const Logo = ({ className = "w-8 h-8", color = "currentColor" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document background */}
      <rect x="4" y="2" width="20" height="26" rx="2" fill={color} opacity="0.1"/>
      <rect x="4" y="2" width="20" height="26" rx="2" stroke={color} strokeWidth="1.5"/>
      
      {/* Document lines */}
      <line x1="8" y1="8" x2="20" y2="8" stroke={color} strokeWidth="1.5"/>
      <line x1="8" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.5"/>
      <line x1="8" y1="16" x2="16" y2="16" stroke={color} strokeWidth="1.5"/>
      
      {/* AI Brain symbol */}
      <circle cx="22" cy="10" r="6" fill={color} opacity="0.2"/>
      <circle cx="22" cy="10" r="4" fill={color} opacity="0.4"/>
      <circle cx="22" cy="10" r="2" fill={color}/>
      
      {/* Neural network connections */}
      <line x1="18" y1="8" x2="20" y2="10" stroke={color} strokeWidth="0.5"/>
      <line x1="18" y1="12" x2="20" y2="10" stroke={color} strokeWidth="0.5"/>
      <line x1="24" y1="8" x2="22" y2="10" stroke={color} strokeWidth="0.5"/>
      <line x1="24" y1="12" x2="22" y2="10" stroke={color} strokeWidth="0.5"/>
    </svg>
  );
};

export default Logo; 