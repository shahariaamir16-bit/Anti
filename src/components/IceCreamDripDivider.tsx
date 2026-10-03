import React from 'react';

interface IceCreamDripDividerProps {
  fillColor?: string;
}

export const IceCreamDripDivider: React.FC<IceCreamDripDividerProps> = ({ fillColor = "fill-stone-900" }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none translate-y-[1px]">
      <svg
        className="relative block w-full h-12 sm:h-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        {/* Exact classic melting/dripping slime path as requested */}
        <path
          d="M0,0 
             L0,20 
             Q40,20 50,45 
             Q60,75 52,85 
             Q45,90 40,80 
             Q35,65 42,40 
             L120,20 
             Q150,20 160,35 
             L220,35 
             Q240,35 250,55 
             Q260,85 255,92 
             Q250,98 245,88 
             Q240,70 245,50 
             L350,35 
             L420,35 
             Q440,35 450,60 
             Q460,95 452,100 
             Q445,105 440,95 
             Q435,75 442,55 
             L550,35 
             L640,35 
             Q660,35 670,55 
             Q680,85 675,95 
             Q670,102 662,90 
             Q658,70 665,45 
             L780,35 
             L860,35 
             Q880,35 890,65 
             Q900,100 892,105 
             Q885,110 880,98 
             Q875,75 882,50 
             L1000,35 
             L1080,35 
             Q1100,35 1110,55 
             Q1120,80 1115,90 
             Q1110,96 1105,85 
             Q1100,65 1105,45 
             L1200,35 
             L1200,100 
             L0,100 Z"
          className={fillColor}
        ></path>
      </svg>
    </div>
  );
};
