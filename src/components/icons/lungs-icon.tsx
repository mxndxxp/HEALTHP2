import * as React from "react";
import { SVGProps } from "react";

export const LungsIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M10 16H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    <path d="M14 16h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <path d="m8 16 2-4-2-4" />
    <path d="m16 16-2-4 2-4" />
    <path d="M12 21v-5l-2-2" />
    <path d="m12 16 2-2" />
  </svg>
);
