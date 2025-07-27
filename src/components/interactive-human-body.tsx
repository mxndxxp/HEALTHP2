
'use client';

import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { LungsIcon } from './icons/lungs-icon';
import { HeartIcon } from './icons/heart-icon';
import { LiverIcon } from './icons/liver-icon';
import { StomachIcon } from './icons/stomach-icon';
import { KidneyIcon } from './icons/kidney-icon';
import { ThyroidIcon } from './icons/thyroid-icon';

type Organ = 'lungs' | 'heart' | 'liver' | 'stomach' | 'kidneys' | 'thyroid';

const organData: {
  name: Organ;
  label: string;
  component: React.ReactNode;
  position: string;
  size: string;
}[] = [
  {
    name: 'lungs',
    label: 'Lungs',
    component: <LungsIcon className="w-full h-full" />,
    position: 'top-[22%] left-1/2 -translate-x-1/2',
    size: 'w-[40%] h-[20%]',
  },
  {
    name: 'heart',
    label: 'Heart',
    component: <HeartIcon className="w-full h-full" />,
    position: 'top-[33%] left-1/2 -translate-x-[60%]',
    size: 'w-[18%] h-[10%]',
  },
  {
    name: 'liver',
    label: 'Liver',
    component: <LiverIcon className="w-full h-full" />,
    position: 'top-[42%] left-[32%]',
    size: 'w-[25%] h-[12%]',
  },
  {
    name: 'stomach',
    label: 'Stomach',
    component: <StomachIcon className="w-full h-full" />,
    position: 'top-[44%] left-[55%]',
    size: 'w-[20%] h-[10%]',
  },
  {
    name: 'kidneys',
    label: 'Kidneys',
    component: <KidneyIcon className="w-full h-full" />,
    position: 'top-[50%] left-1/2 -translate-x-1/2',
    size: 'w-[25%] h-[12%]',
  },
  {
    name: 'thyroid',
    label: 'Thyroid',
    component: <ThyroidIcon className="w-full h-full" />,
    position: 'top-[18%] left-1/2 -translate-x-1/2',
    size: 'w-[15%] h-[8%]',
  },
];

const OrganComponent = ({
  organ,
  selectedOrgan,
  onSelect,
}: {
  organ: typeof organData[0];
  selectedOrgan: Organ | null;
  onSelect: (organ: Organ) => void;
}) => {
  const isSelected = selectedOrgan === organ.name;
  return (
    <div
      className={cn(
        'absolute transform cursor-pointer transition-all duration-300',
        organ.position,
        organ.size,
        isSelected
          ? 'scale-125 z-20 text-blue-500'
          : 'text-gray-400 hover:text-blue-400 hover:scale-110'
      )}
      onClick={() => onSelect(organ.name)}
      title={organ.label}
    >
      {organ.component}
    </div>
  );
};

export function InteractiveHumanBody() {
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null);

  const handleSelectOrgan = (organ: Organ) => {
    setSelectedOrgan(prev => (prev === organ ? null : organ));
  };

  return (
    <div className="relative w-[300px] h-[525px]">
      {/* Base Body Shape */}
      <svg
        viewBox="0 0 200 350"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 10 C 120 10, 140 30, 140 50 C 140 70, 120 80, 120 100 L 120 180 C 140 200, 140 300, 100 340 S 60 200, 80 180 L 80 100 C 80 80, 60 70, 60 50 C 60 30, 80 10, 100 10 Z"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
      </svg>

      {/* Organs */}
      <div className="absolute inset-0">
        {organData.map(organ => (
          <OrganComponent
            key={organ.name}
            organ={organ}
            selectedOrgan={selectedOrgan}
            onSelect={handleSelectOrgan}
          />
        ))}
      </div>

       {selectedOrgan && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-background/80 border rounded-lg p-2 text-center text-sm font-semibold shadow-lg">
          {organData.find(o => o.name === selectedOrgan)?.label}
        </div>
      )}
    </div>
  );
}

