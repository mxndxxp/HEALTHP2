'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  isLower?: boolean;
};

const ToothComponent = ({ id, label, isSelected, onClick, isLower = false }: ToothProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-125 hover:z-10",
        isLower && "flex-col-reverse"
      )}
    >
      <button
        onClick={() => onClick(id)}
        className="flex flex-col items-center justify-center p-1"
        title={`Tooth ${label}`}
      >
        <ToothIcon
          className={cn(
            "h-8 w-8 text-gray-300 stroke-gray-500 transition-colors",
            isSelected && "text-primary/70 fill-primary/30 stroke-primary",
            isLower && "transform -scale-y-100"
          )}
        />
        <span className={cn("text-xs mt-1 font-medium", isSelected ? 'text-primary' : 'text-muted-foreground')}>{label}</span>
      </button>
    </div>
  );
};

const upperRight = Array.from({ length: 8 }, (_, i) => 8 - i); // 8 -> 1
const upperLeft = Array.from({ length: 8 }, (_, i) => i + 9);    // 9 -> 16
const lowerLeft = Array.from({ length: 8 }, (_, i) => i + 17);   // 17 -> 24
const lowerRight = Array.from({ length: 8 }, (_, i) => 32 - i); // 32 -> 25

export function InteractiveDentalChart() {
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);

  const handleToothClick = (id: string) => {
    setSelectedTeeth((prev) =>
      prev.includes(id) ? prev.filter((toothId) => toothId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-2 font-sans">
      {/* Upper Arch */}
      <div className="flex justify-center items-end">
        {/* Upper Right */}
        <div className="flex flex-col items-center">
            <div className="flex">
                {upperRight.map((toothNum) => (
                    <ToothComponent
                        key={`T${toothNum}`}
                        id={`T${toothNum}`}
                        label={`${toothNum}`}
                        isSelected={selectedTeeth.includes(`T${toothNum}`)}
                        onClick={handleToothClick}
                    />
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Upper Right</p>
        </div>

        <div className="border-l border-muted-foreground h-16 mx-2"></div>
        
        {/* Upper Left */}
        <div className="flex flex-col items-center">
             <div className="flex">
                {upperLeft.map((toothNum) => (
                    <ToothComponent
                        key={`T${toothNum}`}
                        id={`T${toothNum}`}
                        label={`${toothNum}`}
                        isSelected={selectedTeeth.includes(`T${toothNum}`)}
                        onClick={handleToothClick}
                    />
                ))}
            </div>
             <p className="text-xs text-muted-foreground mt-1">Upper Left</p>
        </div>
      </div>

      <div className="border-b w-full my-4 border-muted-foreground"></div>

      {/* Lower Arch */}
      <div className="flex justify-center items-start">
         {/* Lower Right */}
        <div className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground mb-1">Lower Right</p>
            <div className="flex">
                {lowerRight.map((toothNum) => (
                    <ToothComponent
                        key={`T${toothNum}`}
                        id={`T${toothNum}`}
                        label={`${toothNum}`}
                        isSelected={selectedTeeth.includes(`T${toothNum}`)}
                        onClick={handleToothClick}
                        isLower
                    />
                ))}
            </div>
        </div>
        
        <div className="border-l border-muted-foreground h-16 mx-2"></div>
        
         {/* Lower Left */}
        <div className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground mb-1">Lower Left</p>
            <div className="flex">
                {lowerLeft.map((toothNum) => (
                    <ToothComponent
                        key={`T${toothNum}`}
                        id={`T${toothNum}`}
                        label={`${toothNum}`}
                        isSelected={selectedTeeth.includes(`T${toothNum}`)}
                        onClick={handleToothClick}
                        isLower
                    />
                ))}
            </div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground pt-6">
        Selected Teeth: {selectedTeeth.join(', ') || 'None'}
      </div>
    </div>
  );
}
