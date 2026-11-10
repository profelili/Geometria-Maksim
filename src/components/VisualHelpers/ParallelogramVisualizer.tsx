import React, { useState } from 'react';

export const ParallelogramVisualizer: React.FC = () => {
  const [sliceProgress, setSliceProgress] = useState<number>(0); // 0 to 100%
  const [base, setBase] = useState<number>(5);
  const [height, setHeight] = useState<number>(3);

  // Scaled coordinates
  // Slant width: dx = 35
  const dx = 35;
  const scale = 25;
  const svgH = height * scale;
  const svgB = base * scale;
  const offsetX = 20;
  const offsetY = 20;

  // Sliced triangle translates by svgB to the right
  const triangleShift = (sliceProgress / 100) * svgB;

  return (
    <div className="space-y-4">
      {/* Transformation Scissor Slider */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            ✂️ <strong>El recorte de Juan:</strong> Deslizá para transformar el paralelogramo en rectángulo
          </span>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {sliceProgress}% {sliceProgress === 100 ? '(¡Rectángulo perfecto!)' : ''}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliceProgress}
          onChange={(e) => setSliceProgress(parseInt(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
          <span>0% Paralelogramo inclinado</span>
          <span>50% Triángulo en traslación</span>
          <span>100% Rectángulo equivalente</span>
        </div>
      </div>

      {/* SVG Animation Canvas */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center">
        <svg
          width="320"
          height="140"
          viewBox="0 0 320 140"
          className="overflow-visible"
        >
          {/* Main body (Trapezoid remainder after slicing triangle) */}
          <polygon
            points={`
              ${offsetX + dx},${offsetY}
              ${offsetX + svgB + dx},${offsetY}
              ${offsetX + svgB},${offsetY + svgH}
              ${offsetX + dx},${offsetY + svgH}
            `}
            fill="#c7d2fe"
            stroke="#4338ca"
            strokeWidth="2"
          />

          {/* Sliced Triangle moving across */}
          <polygon
            points={`
              ${offsetX + triangleShift},${offsetY + svgH}
              ${offsetX + dx + triangleShift},${offsetY}
              ${offsetX + dx + triangleShift},${offsetY + svgH}
            `}
            fill="#818cf8"
            stroke="#312e81"
            strokeWidth="2"
            opacity={sliceProgress > 0 ? 0.9 : 1}
          />

          {/* Height Line (perpendicular) */}
          <line
            x1={offsetX + dx}
            y1={offsetY}
            x2={offsetX + dx}
            y2={offsetY + svgH}
            stroke="#dc2626"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <text
            x={offsetX + dx + 6}
            y={offsetY + svgH / 2 + 4}
            fill="#dc2626"
            fontSize="12"
            fontWeight="bold"
          >
            h = {height} cm
          </text>

          {/* Base Marker */}
          <line
            x1={offsetX}
            y1={offsetY + svgH + 15}
            x2={offsetX + svgB}
            y2={offsetY + svgH + 15}
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <text
            x={offsetX + svgB / 2}
            y={offsetY + svgH + 28}
            textAnchor="middle"
            fill="#1e293b"
            fontSize="12"
            fontWeight="bold"
          >
            b = {base} cm
          </text>
        </svg>

        {/* Live Formula Display */}
        <div className="mt-3 p-3 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 w-full max-w-sm text-center">
          <div className="text-xs text-indigo-900 dark:text-indigo-200 font-medium">
            Fórmula universal: <strong className="font-mono text-sm">Área = base × altura (A = b × h)</strong>
          </div>
          <div className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 font-mono">
            {base} cm × {height} cm = <strong className="text-sm font-bold text-indigo-950 dark:text-white">{base * height} cm²</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
