import React from 'react';
import type { TeamMember } from '../../types/HomeTypes';

export const TeamCard: React.FC<TeamMember> = ({ name, role, description, imageUrl }) => (
  <div className="snap-start shrink-0 w-80 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-center">
    {/* Container da foto ocupando a largura total do card com altura fixa */}
    <div className="w-full h-64 overflow-hidden bg-zinc-100">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105" 
      />
    </div>

    {/* Conteúdo de texto abaixo da foto */}
    <div className="p-6 flex flex-col items-center">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-blue-600 font-medium text-xs mb-4 uppercase tracking-wider">{role}</p>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);