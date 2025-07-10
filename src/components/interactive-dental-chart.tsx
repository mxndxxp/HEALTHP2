'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// A more detailed, 3D-style tooth icon
const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M16.5,2.5c-1.2,0-2.3,0.4-3.2,1.1c-1.2,0.9-2.6,2.5-2.6,4.2c0,0.3,0.1,0.6,0.2,0.9l-0.1-0.1 c-1.5-1.5-3.6-2.4-5.8-2.4c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8c0-0.1,0-0.2,0-0.3c0.6-1,1.7-2.9,3.2-2.9c1.5,0,2.8,1.8,3.2,2.9 c0,0.1,0,0.2,0,0.3c0,4.4,3.6,8,8,8s8-3.6,8-8s-3.6-8-8-8c-2.3,0-4.3,0.9-5.8,2.4l-0.1,0.1c0.1-0.3,0.2-0.6,0.2-0.9 c0-1.7-1.4-3.3-2.6-4.2C18.8,2.9,17.7,2.5,16.5,2.5z" />
    </svg>
);


type ToothProps = {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  className?: string;
  rotation: number;
};

const ToothComponent = ({ id, label, isSelected, onClick, className, rotation }: ToothProps) => {
  return (
    <div
      className={cn("absolute w-12 h-16 flex items-center justify-center", className)}
      style={{ transform: `rotate(${rotation}deg) translate(10rem) rotate(${-rotation}deg)` }}
    >
        <button
          onClick={() => onClick(id)}
          className={cn(
            "flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-125"
          )}
          title={`Tooth ${label}`}
        >
          <ToothIcon
            className={cn(
              "h-8 w-8 text-gray-300 stroke-gray-500 transition-colors",
              isSelected && "text-primary/70 fill-primary/30 stroke-primary"
            )}
          />
          <span className={cn("text-xs mt-1 font-medium", isSelected ? 'text-primary' : 'text-muted-foreground')}>{label}</span>
        </button>
    </div>
  );
};

const upperRight = [1, 2, 3, 4, 5, 6, 7, 8];
const upperLeft = [9, 10, 11, 12, 13, 14, 15, 16];
const lowerLeft = [17, 18, 19, 20, 21, 22, 23, 24];
const lowerRight = [25, 26, 27, 28, 29, 30, 31, 32];

const archAngle = 160; // Total angle for the arch
const lowerArchAngle = 140;

const getRotation = (index: number, total: number, arch: 'upper' | 'lower' = 'upper') => {
    const angle = arch === 'upper' ? archAngle : lowerArchAngle;
    const startAngle = -angle / 2;
    const step = angle / (total -1);
    return startAngle + index * step;
};

export function InteractiveDentalChart() {
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);

  const handleToothClick = (id: string) => {
    setSelectedTeeth((prev) =>
      prev.includes(id) ? prev.filter((toothId) => toothId !== id) : [...prev, id]
    );
  };

  const allUpperTeeth = [...upperRight.reverse(), ...upperLeft];
  const allLowerTeeth = [...lowerLeft.reverse(), ...lowerRight];

  return (
    <div className="w-full max-w-xl mx-auto p-4 space-y-8 flex flex-col items-center">
        <div className="relative w-96 h-48 flex items-center justify-center">
             <div className="text-center font-semibold text-muted-foreground absolute -top-4">Upper Arch</div>
            {allUpperTeeth.map((toothNum, index) => (
                <ToothComponent
                    key={`T${toothNum}`}
                    id={`T${toothNum}`}
                    label={`${toothNum}`}
                    isSelected={selectedTeeth.includes(`T${toothNum}`)}
                    onClick={handleToothClick}
                    rotation={getRotation(index, allUpperTeeth.length, 'upper')}
                />
            ))}
        </div>

       <div className="relative w-96 h-48 flex items-center justify-center">
          <div className="text-center font-semibold text-muted-foreground absolute -bottom-4">Lower Arch</div>
            {allLowerTeeth.map((toothNum, index) => (
                <ToothComponent
                    key={`T${toothNum}`}
                    id={`T${toothNum}`}
                    label={`${toothNum}`}
                    isSelected={selectedTeeth.includes(`T${toothNum}`)}
                    onClick={handleToothClick}
                    rotation={getRotation(index, allLowerTeeth.length, 'lower') + 180 + (archAngle - lowerArchAngle)/2}
                />
            ))}
       </div>

      <div className="text-xs text-center text-muted-foreground pt-4">
        Selected Teeth: {selectedTeeth.join(', ') || 'None'}
      </div>
    </div>
  );
}
