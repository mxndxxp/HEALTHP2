
declare module 'react-signature-canvas' {
  import { Component, RefObject } from 'react';

  export interface SignatureCanvasProps {
    penColor?: string;
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    backgroundColor?: string;
    dotSize?: number | (() => number);
    minWidth?: number;
    maxWidth?: number;
    throttle?: number;
    minDistance?: number;
    velocityFilterWeight?: number;
    onEnd?: (event: MouseEvent | TouchEvent) => void;
    onBegin?: (event: MouseEvent | TouchEvent) => void;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    isEmpty(): boolean;
    toDataURL(mimeType?: string, encoderOptions?: number): string;
    fromDataURL(base64Data: string, options?: { ratio?: number, width?: number, height?: number, xOffset?: number, yOffset?: number }): void;
    toData(): { x: number; y: number; time: number; color: string }[][];
    fromData(pointGroups: { x: number; y: number; time: number; color: string }[][]): void;
    getTrimmedCanvas(): HTMLCanvasElement;
    getCanvas(): HTMLCanvasElement;
    on(): void;
    off(): void;
  }
}
