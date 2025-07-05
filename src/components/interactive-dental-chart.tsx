'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type ToothProps = {
  id: number;
  d: string;
  isSelected: boolean;
  onToggle: (id: number) => void;
  transform?: string;
};

const Tooth = ({ id, d, isSelected, onToggle, transform }: ToothProps) => (
  <g transform={transform}>
    <path
      d={d}
      className={cn(
        'fill-white stroke-gray-400 stroke-1 transition-all duration-200 cursor-pointer hover:fill-blue-200',
        isSelected && 'fill-primary stroke-blue-700'
      )}
      onClick={() => onToggle(id)}
    />
    <text
      x="0"
      y="0"
      textAnchor="middle"
      dy="0.3em"
      className="text-[10px] fill-gray-600 pointer-events-none"
    >
      {id}
    </text>
  </g>
);

const teethData = [
  // Upper Right (Quadrant 1)
  { id: 18, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(235, 30)' },
  { id: 17, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(215, 30)' },
  { id: 16, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(195, 30)' },
  { id: 15, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(175, 30)' },
  { id: 14, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(155, 30)' },
  { id: 13, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(135, 30)' },
  { id: 12, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(115, 30)' },
  { id: 11, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(95, 30)' },
  // Upper Left (Quadrant 2)
  { id: 21, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(75, 30)' },
  { id: 22, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(55, 30)' },
  { id: 23, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(35, 30)' },
  { id: 24, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(15, 30)' },
  { id: 25, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(-5, 30)' },
  { id: 26, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(-25, 30)' },
  { id: 27, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(-45, 30)' },
  { id: 28, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(-65, 30)' },

  // Lower Left (Quadrant 3)
  { id: 38, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(-65, 80)' },
  { id: 37, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(-45, 80)' },
  { id: 36, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(-25, 80)' },
  { id: 35, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(-5, 80)' },
  { id: 34, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(15, 80)' },
  { id: 33, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(35, 80)' },
  { id: 32, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(55, 80)' },
  { id: 31, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(75, 80)' },
  // Lower Right (Quadrant 4)
  { id: 41, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(95, 80)' },
  { id: 42, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(115, 80)' },
  { id: 43, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(135, 80)' },
  { id: 44, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(155, 80)' },
  { id: 45, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(175, 80)' },
  { id: 46, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(195, 80)' },
  { id: 47, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(215, 80)' },
  { id: 48, d: 'M-60,5 L-50,5 L-50,15 L-60,15 Z', transform: 'translate(235, 80)' },
];

export function InteractiveDentalChart() {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);

  const handleToggleTooth = (id: number) => {
    setSelectedTeeth((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="-90 -10 450 150" className="max-w-full h-auto">
        <path d="M 85 55 C 40 55, 40 55, -10 55" stroke="#F87171" strokeWidth="2" fill="none" />
        <path d="M 85 65 C 40 65, 40 65, -10 65" stroke="#F87171" strokeWidth="2" fill="none" />
        {teethData.map((tooth) => (
          <Tooth
            key={tooth.id}
            id={tooth.id}
            d={tooth.d}
            transform={tooth.transform}
            isSelected={selectedTeeth.includes(tooth.id)}
            onToggle={handleToggleTooth}
          />
        ))}
        <text x="165" y="15" className="text-sm font-bold fill-gray-500">Upper Jaw</text>
        <text x="165" y="115" className="text-sm font-bold fill-gray-500">Lower Jaw</text>
      </svg>
    </div>
  );
}
