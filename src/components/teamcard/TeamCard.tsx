import React from 'react';
import type { TeamMember } from '../../types/HomeTypes';


export const TeamCard: React.FC<TeamMember> = ({ name, role, description, imageUrl }) => (
  <div className="snap-start shrink-0 w-80 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
    <img 
      src={imageUrl} 
      alt={name} 
      className="w-24 h-24 rounded-full object-contain mb-5 shadow-md border-2 border-blue-100" 
    />
    <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
    <p className="text-blue-600 font-medium text-xs mb-4 uppercase tracking-wider">{role}</p>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);