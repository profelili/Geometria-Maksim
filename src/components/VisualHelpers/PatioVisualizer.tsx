import React, { useState } from 'react';

export const PatioVisualizer: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<'green' | 'red' | 'gray' | 'yellow'>('green');

  const tiles = {
    green: { name: 'Verde (20 × 20 cm)', w: 20, h: 20, area: 400, color: '#10b981', exact: true, cols: 20, rows: 15, count: 300, why: '400 cm ÷ 20 = 20 y 300 cm ÷ 20 = 15. ¡Encajan exactas sin cortes!' },
    red: { name: 'Roja (15 × 15 cm)', w: 15, h: 15, area: 225, color: '#ef4444', exact: false, cols: 26.67, rows: 20, count: 533.3, why: '400 cm ÷ 15 = 26,67. No es división exacta a lo largo.' },
    gray: { name: 'Gris (15 × 30 cm)', w: 30, h: 15, area: 450, color: '#64748b', exact: false, cols: 13.33, rows: 20, count: 266.6, why: '400 cm ÷ 30 = 13,33. Requiere cortar baldosas.' },
    yellow: { name: 'Amarilla (15 × 25 cm)', w: 25, h: 15, area: 375, color: '#f59e0b', exact: true, cols: 16, rows: 20, count: 320, why: '400 cm ÷ 25 = 16 y 300 cm ÷ 15 = 20. ¡Encaja exacto!' }
  };

  const current = tiles[selectedTile];

  return (
    <div className="space-y-4">
      {/* Tile Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(tiles) as (keyof typeof tiles)[]).map(key => {
          const t = tiles[key];
          const isSelected = selectedTile === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedTile(key)}
              className={`p-2.5 rounded-xl border text-xs text-left transition ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-500 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.color }}></span>
                <span className="truncate">{t.name}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {t.exact ? '✓ Encaje perfecto' : '⚠ Requiere cortes'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Patio Blueprint SVG */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Plano del Patio: 4 m (400 cm) de largo × 3 m (300 cm) de ancho
          </div>
          <svg width="240" height="180" viewBox="0 0 240 180" className="border-2 border-slate-700 dark:border-slate-400 rounded-lg bg-white dark:bg-slate-900 shadow">
            {/* Simulation Grid */}
            {selectedTile === 'green' && (
              Array.from({ length: 15 }).map((_, r) =>
                Array.from({ length: 20 }).map((_, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={c * 12}
                    y={r * 12}
                    width="12"
                    height="12"
                    fill={`${current.color}30`}
                    stroke={current.color}
                    strokeWidth="0.5"
                  />
                ))
              )
            )}
            {selectedTile === 'yellow' && (
              Array.from({ length: 20 }).map((_, r) =>
                Array.from({ length: 16 }).map((_, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={c * 15}
                    y={r * 9}
                    width="15"
                    height="9"
                    fill={`${current.color}35`}
                    stroke={current.color}
                    strokeWidth="0.5"
                  />
                ))
              )
            )}
            {(selectedTile === 'red' || selectedTile === 'gray') && (
              <rect x="0" y="0" width="240" height="180" fill={`${current.color}20`} stroke={current.color} strokeWidth="1" strokeDasharray="4" />
            )}
            {/* Dimensions */}
            <text x="120" y="95" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">
              12 m² = 120.000 cm²
            </text>
          </svg>
          <div className="flex justify-between w-60 text-[11px] text-slate-500 font-mono mt-1 px-1">
            <span>Ancho: 300 cm</span>
            <span>Largo: 400 cm</span>
          </div>
        </div>

        {/* Diagnosis Card */}
        <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${current.exact ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'}`}>
              {current.exact ? 'Cubre exactamente sin desperdicio' : 'No cubre exactamente'}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium">
            {current.why}
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1 text-slate-600 dark:text-slate-400">
            <div>• Área de 1 baldosa: <strong className="font-mono">{current.area} cm²</strong></div>
            <div>• Baldosas estimadas: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{current.count}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
