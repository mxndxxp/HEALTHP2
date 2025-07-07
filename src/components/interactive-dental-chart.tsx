'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Define a custom Tooth icon as an inline SVG component
const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 20h12l-1.5-14h-9z" />
      <path d="M12 20v-4" />
      <path d="M16 13a4 4 0 0 0-8 0" />
    </svg>
  );


type ToothProps = {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  className?: string;
};

const ToothComponent = ({ id, label, isSelected, onClick, className }: ToothProps) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-110",
        className
      )}
      title={`Tooth ${label}`}
    >
      <ToothIcon
        className={cn(
          "h-8 w-8 text-gray-400 transition-colors",
          isSelected && "text-primary fill-primary/20"
        )}
      />
      <span className="text-xs mt-1 text-muted-foreground">{label}</span>
    </button>
  );
};

const upperArchOrder = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerArchOrder = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export function InteractiveDentalChart() {
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);

  const handleToothClick = (id: string) => {
    setSelectedTeeth((prev) =>
      prev.includes(id) ? prev.filter((toothId) => toothId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-lg p-4 space-y-4 rounded-lg bg-muted/40">
      <div className="text-center font-semibold text-muted-foreground">Upper Arch</div>
      <div className="grid grid-cols-8 gap-1">
        {upperArchOrder.slice(0, 8).map((toothNum) => (
          <ToothComponent
            key={`T${toothNum}`}
            id={`T${toothNum}`}
            label={`${toothNum}`}
            isSelected={selectedTeeth.includes(`T${toothNum}`)}
            onClick={handleToothClick}
          />
        ))}
        {upperArchOrder.slice(8).map((toothNum) => (
          <ToothComponent
            key={`T${toothNum}`}
            id={`T${toothNum}`}
            label={`${toothNum}`}
            isSelected={selectedTeeth.includes(`T${toothNum}`)}
            onClick={handleToothClick}
          />
        ))}
      </div>
       <div className="grid grid-cols-8 gap-1 pt-4">
        {lowerArchOrder.slice(0, 8).map((toothNum) => (
          <ToothComponent
            key={`T${toothNum}`}
            id={`T${toothNum}`}
            label={`${toothNum}`}
            isSelected={selectedTeeth.includes(`T${toothNum}`)}
            onClick={handleToothClick}
            className="transform scale-y-[-1]"
          />
        ))}
        {lowerArchOrder.slice(8).map((toothNum) => (
          <ToothComponent
            key={`T${toothNum}`}
            id={`T${toothNum}`}
            label={`${toothNum}`}
            isSelected={selectedTeeth.includes(`T${toothNum}`)}
            onClick={handleToothClick}
            className="transform scale-y-[-1]"
          />
        ))}
      </div>
      <div className="text-center font-semibold text-muted-foreground">Lower Arch</div>
      <div className="text-xs text-center text-muted-foreground pt-4">
        Selected Teeth: {selectedTeeth.join(', ') || 'None'}
      </div>
    </div>
  );
}
