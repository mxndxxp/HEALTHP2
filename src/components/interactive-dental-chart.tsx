
'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type ToothProps = {
  id: number;
  d: string;
  isSelected: boolean;
  onToggle: (id: number) => void;
  transform?: string;
  textPos: { x: number; y: number };
};

const Tooth = ({ id, d, isSelected, onToggle, transform, textPos }: ToothProps) => (
  <g transform={transform} className="cursor-pointer" onClick={() => onToggle(id)}>
    <defs>
        <radialGradient id={`grad-${id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: 'hsl(var(--card))', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'hsl(var(--border))', stopOpacity: 1}} />
        </radialGradient>
        <radialGradient id={`grad-selected-${id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.6}} />
            <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
        </radialGradient>
    </defs>
    <path
      d={d}
      className={cn(
        'stroke-gray-400 stroke-[0.5] transition-all duration-200 hover:opacity-80',
        isSelected ? 'fill-primary' : ''
      )}
      style={!isSelected ? { fill: `url(#grad-${id})` } : {}}
    />
     <path
      d={d}
      className={'transition-all duration-200'}
      style={{ fill: isSelected ? `url(#grad-selected-${id})` : 'transparent' }}
    />
    <text
      x={textPos.x}
      y={textPos.y}
      textAnchor="middle"
      dy="0.3em"
      className={cn("text-[8px] pointer-events-none", isSelected ? 'fill-primary-foreground': 'fill-muted-foreground')}
    >
      {id}
    </text>
  </g>
);

const teethData: Omit<ToothProps, 'isSelected' | 'onToggle'>[] = [
  // Upper Right (Quadrant 1)
  { id: 18, d: "M0,0 Q5, -15 10,0 T20,0 L20,15 Q10,25 0,15 Z", textPos: { x: 10, y: 8 }, transform: "translate(170, 20) scale(0.8)" },
  { id: 17, d: "M0,0 Q5, -15 10,0 T20,0 L20,15 Q10,25 0,15 Z", textPos: { x: 10, y: 8 }, transform: "translate(150, 22) scale(0.9)" },
  { id: 16, d: "M0,0 Q5, -15 10,0 T20,0 L20,15 Q10,25 0,15 Z", textPos: { x: 10, y: 8 }, transform: "translate(130, 25) scale(0.9)" },
  { id: 15, d: "M0,0 Q5, -15 10,0 T18,0 L18,15 Q9,22 0,15 Z", textPos: { x: 9, y: 8 }, transform: "translate(112, 28) scale(0.8)" },
  { id: 14, d: "M0,0 Q5, -15 10,0 T18,0 L18,15 Q9,22 0,15 Z", textPos: { x: 9, y: 8 }, transform: "translate(94, 28) scale(0.8)" },
  { id: 13, d: "M0,0 Q4,-18 8,0 L8,15 Q4,20 0,15 Z", textPos: { x: 4, y: 8 }, transform: "translate(80, 28) scale(0.9)" },
  { id: 12, d: "M0,0 Q4,-18 8,0 L8,15 Q4,20 0,15 Z", textPos: { x: 4, y: 8 }, transform: "translate(68, 28) scale(0.9)" },
  { id: 11, d: "M0,0 Q5,-18 10,0 L10,15 Q5,20 0,15 Z", textPos: { x: 5, y: 8 }, transform: "translate(52, 28) scale(0.9)" },
  // Upper Left (Quadrant 2)
  { id: 21, d: "M0,0 Q5,-18 10,0 L10,15 Q5,20 0,15 Z", textPos: { x: 5, y: 8 }, transform: "translate(38, 28) scale(0.9)" },
  { id: 22, d: "M0,0 Q4,-18 8,0 L8,15 Q4,20 0,15 Z", textPos: { x: 4, y: 8 }, transform: "translate(24, 28) scale(0.9)" },
  { id: 23, d: "M0,0 Q4,-18 8,0 L8,15 Q4,20 0,15 Z", textPos: { x: 4, y: 8 }, transform: "translate(10, 28) scale(0.9)" },
  { id: 24, d: "M0,0 Q5, -15 10,0 T18,0 L18,15 Q9,22 0,15 Z", textPos: { x: 9, y: 8 }, transform: "translate(-12, 28) scale(0.8)" },
  { id: 25, d: "M0,0 Q5, -15 10,0 T18,0 L18,15 Q9,22 0,15 Z", textPos: { x: 9, y: 8 }, transform: "translate(-30, 28) scale(0.8)" },
  { id: 26, d: "M0,0 Q5, -15 10,0 T20,0 L20,15 Q10,25 0,15 Z", textPos: { x: 10, y: 8 }, transform: "translate(-54, 25) scale(0.9)" },
  { id: 27, d: "M0,0 Q5, -15 10,0 T20,0 L20,15 Q10,25 0,15 Z", textPos: { x: 10, y: 8 }, transform: "translate(-74, 22) scale(0.9)" },
  { id: 28, d: "M0,0 Q5, -15 10,0 T20,0 L20,15 Q10,25 0,15 Z", textPos: { x: 10, y: 8 }, transform: "translate(-94, 20) scale(0.8)" },

  // Lower Left (Quadrant 3)
  { id: 38, d: "M0,15 Q5,30 10,15 T20,15 L20,0 Q10,-10 0,0 Z", textPos: { x: 10, y: 7 }, transform: "translate(-94, 75) scale(0.8)" },
  { id: 37, d: "M0,15 Q5,30 10,15 T20,15 L20,0 Q10,-10 0,0 Z", textPos: { x: 10, y: 7 }, transform: "translate(-74, 73) scale(0.9)" },
  { id: 36, d: "M0,15 Q5,30 10,15 T20,15 L20,0 Q10,-10 0,0 Z", textPos: { x: 10, y: 7 }, transform: "translate(-54, 70) scale(0.9)" },
  { id: 35, d: "M0,15 Q5,27 10,15 T18,15 L18,0 Q9,-7 0,0 Z", textPos: { x: 9, y: 7 }, transform: "translate(-30, 67) scale(0.8)" },
  { id: 34, d: "M0,15 Q5,27 10,15 T18,15 L18,0 Q9,-7 0,0 Z", textPos: { x: 9, y: 7 }, transform: "translate(-12, 67) scale(0.8)" },
  { id: 33, d: "M0,15 Q4,33 8,15 L8,0 Q4,-5 0,0 Z", textPos: { x: 4, y: 7 }, transform: "translate(10, 67) scale(0.9)" },
  { id: 32, d: "M0,15 Q4,33 8,15 L8,0 Q4,-5 0,0 Z", textPos: { x: 4, y: 7 }, transform: "translate(24, 67) scale(0.9)" },
  { id: 31, d: "M0,15 Q5,33 10,15 L10,0 Q5,-5 0,0 Z", textPos: { x: 5, y: 7 }, transform: "translate(38, 67) scale(0.9)" },
  // Lower Right (Quadrant 4)
  { id: 41, d: "M0,15 Q5,33 10,15 L10,0 Q5,-5 0,0 Z", textPos: { x: 5, y: 7 }, transform: "translate(52, 67) scale(0.9)" },
  { id: 42, d: "M0,15 Q4,33 8,15 L8,0 Q4,-5 0,0 Z", textPos: { x: 4, y: 7 }, transform: "translate(68, 67) scale(0.9)" },
  { id: 43, d: "M0,15 Q4,33 8,15 L8,0 Q4,-5 0,0 Z", textPos: { x: 4, y: 7 }, transform: "translate(80, 67) scale(0.9)" },
  { id: 44, d: "M0,15 Q5,27 10,15 T18,15 L18,0 Q9,-7 0,0 Z", textPos: { x: 9, y: 7 }, transform: "translate(94, 67) scale(0.8)" },
  { id: 45, d: "M0,15 Q5,27 10,15 T18,15 L18,0 Q9,-7 0,0 Z", textPos: { x: 9, y: 7 }, transform: "translate(112, 67) scale(0.8)" },
  { id: 46, d: "M0,15 Q5,30 10,15 T20,15 L20,0 Q10,-10 0,0 Z", textPos: { x: 10, y: 7 }, transform: "translate(130, 70) scale(0.9)" },
  { id: 47, d: "M0,15 Q5,30 10,15 T20,15 L20,0 Q10,-10 0,0 Z", textPos: { x: 10, y: 7 }, transform: "translate(150, 73) scale(0.9)" },
  { id: 48, d: "M0,15 Q5,30 10,15 T20,15 L20,0 Q10,-10 0,0 Z", textPos: { x: 10, y: 7 }, transform: "translate(170, 75) scale(0.8)" },
];

export function InteractiveDentalChart() {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([14, 24]);

  const handleToggleTooth = (id: number) => {
    setSelectedTeeth((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="-100 0 400 130" className="max-w-full h-auto">
        <path d="M 90 60 C -10 40, -10 80, 90 60" stroke="hsl(var(--border))" strokeWidth="1" fill="hsl(var(--muted))" />
        {teethData.map((tooth) => (
          <Tooth
            key={tooth.id}
            id={tooth.id}
            d={tooth.d}
            transform={tooth.transform}
            isSelected={selectedTeeth.includes(tooth.id)}
            onToggle={handleToggleTooth}
            textPos={tooth.textPos}
          />
        ))}
        <text x="0" y="15" className="text-xs font-bold fill-gray-500">Upper Jaw</text>
        <text x="0" y="118" className="text-xs font-bold fill-gray-500">Lower Jaw</text>
      </svg>
    </div>
  );
}
