import React, { useState } from 'react';

export const GridUnitsVisualizer: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const unitDetails = {
    A: { name: 'Unidad A', cells: 2, desc: 'Rectángulo 2 × 1 cuadraditos', color: '#f59e0b', countInFig1: 6 },
    B: { name: 'Unidad B', cells: 4, desc: 'Cuadrado 2 × 2 cuadraditos', color: '#ef4444', countInFig1: 3 },
    C: { name: 'Unidad C', cells: 1, desc: '1 cuadradito individual', color: '#0ea5e9', countInFig1: 12 },
    D: { name: 'Unidad D', cells: 2, desc: 'Triángulo diagonal (mitad de 2×2)', color: '#8b5cf6', countInFig1: 6 }
  };

  const curr = unitDetails[selectedUnit];

  return (
    <div className="space-y-4">
      {/* Selector of Units */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['A', 'B', 'C', 'D'] as const).map(u => {
          const info = unitDetails[u];
          const isSelected = selectedUnit === u;
          return (
            <button
              key={u}
              type="button"
              onClick={() => setSelectedUnit(u)}
              className={`p-3 rounded-xl border text-left transition ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{info.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: `${info.color}20`, color: info.color }}>
                  {info.cells} cuadritos
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {info.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Canvas of Figure 1 (4x3 = 12 cells) */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Figura 1 (4 base × 3 altura = 12 cuadraditos)
          </span>
          <svg width="180" height="135" className="border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 shadow-inner">
            {/* 4x3 Grid */}
            {Array.from({ length: 4 }).map((_, c) =>
              Array.from({ length: 3 }).map((_, r) => (
                <rect
                  key={`${c}-${r}`}
                  x={c * 40 + 10}
                  y={r * 40 + 10}
                  width="40"
                  height="40"
                  fill={selectedUnit === 'C' ? `${curr.color}40` : (selectedUnit === 'A' && c % 2 === 0 ? `${curr.color}35` : selectedUnit === 'B' && c < 2 && r < 2 ? `${curr.color}35` : '#f8fafc dark:#0f172a')}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
              ))
            )}
            {/* Text labels */}
            <text x="90" y="75" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="bold">
              12 cuadraditos
            </text>
          </svg>
        </div>

        {/* Dynamic Measurement Card */}
        <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Medición con {curr.name}:
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            • Tamaño de la unidad: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{curr.cells} cuadraditos</strong>
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            • Superficie de la Figura 1: <strong className="font-mono text-indigo-600 dark:text-indigo-400">12 cuadraditos</strong>
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
            Cálculo: <code className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono">12 ÷ {curr.cells} = {curr.countInFig1} {curr.name}</code>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            El valor numérico del área cambia según la unidad elegida. Para comparar figuras es imprescindible utilizar siempre la misma unidad.
          </p>
        </div>
      </div>
    </div>
  );
};
