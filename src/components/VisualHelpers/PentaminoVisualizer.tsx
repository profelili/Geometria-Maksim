import React, { useState } from 'react';

interface PentaminoShape {
  name: string;
  color: string;
  coords: [number, number][]; // [x, y] coordinates in 5x5 grid
}

const PENTAMINOES: PentaminoShape[] = [
  { name: 'I', color: '#0284c7', coords: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
  { name: 'L', color: '#4f46e5', coords: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]] },
  { name: 'P', color: '#ec4899', coords: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]] },
  { name: 'T', color: '#eab308', coords: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]] },
  { name: 'U', color: '#10b981', coords: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 0]] },
  { name: 'V', color: '#8b5cf6', coords: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] },
  { name: 'W', color: '#f97316', coords: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]] },
  { name: 'X', color: '#ef4444', coords: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
  { name: 'Y', color: '#06b6d4', coords: [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0]] },
  { name: 'Z', color: '#84cc16', coords: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]] },
  { name: 'F', color: '#d946ef', coords: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]] },
  { name: 'N', color: '#64748b', coords: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1]] },
];

export const PentaminoVisualizer: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<string>('L');
  const [activeRect, setActiveRect] = useState<'10x6' | '12x5' | '20x3'>('10x6');

  const currentShape = PENTAMINOES.find(p => p.name === selectedPiece) || PENTAMINOES[1];

  const rectSpecs = {
    '10x6': { base: 10, height: 6, area: 60, perimeter: 32 },
    '12x5': { base: 12, height: 5, area: 60, perimeter: 34 },
    '20x3': { base: 20, height: 3, area: 60, perimeter: 46 }
  };

  const currentRect = rectSpecs[activeRect];

  return (
    <div className="space-y-6">
      {/* 12 Pieces Gallery */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Las 12 Fichas de Pentaminó (5 cuadritos c/u)
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Pieza seleccionada: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{currentShape.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {PENTAMINOES.map((p) => {
            const isSelected = p.name === selectedPiece;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setSelectedPiece(p.name)}
                className={`p-1.5 rounded-lg flex flex-col items-center transition-all ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 bg-white dark:bg-slate-700 shadow-sm'
                    : 'bg-white/60 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <svg width="34" height="34" viewBox="0 0 45 45">
                  {p.coords.map(([x, y], idx) => (
                    <rect
                      key={idx}
                      x={x * 8 + 6}
                      y={y * 8 + 6}
                      width="7.5"
                      height="7.5"
                      fill={p.color}
                      stroke="#1e293b"
                      strokeWidth="0.8"
                      rx="1"
                    />
                  ))}
                </svg>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspector of Selected Piece */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
          <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <svg width="70" height="70" viewBox="0 0 60 60">
              {currentShape.coords.map(([x, y], idx) => (
                <rect
                  key={idx}
                  x={x * 12 + 6}
                  y={y * 12 + 6}
                  width="11"
                  height="11"
                  fill={currentShape.color}
                  stroke="#0f172a"
                  strokeWidth="1.2"
                  rx="1.5"
                />
              ))}
            </svg>
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Pentaminó Tipo {currentShape.name}
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              • Cuadraditos: <strong>5</strong>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              • Área elemental: <strong>5 u²</strong>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              • Conexión: Lados completos compartidos
            </div>
          </div>
        </div>

        {/* Rectangle comparison */}
        <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900 text-xs flex flex-col justify-between">
          <div>
            <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm mb-1">
              Rectángulos armados con las 12 fichas:
            </div>
            <p className="text-indigo-700 dark:text-indigo-300">
              12 fichas × 5 cuadritos = <strong>60 cuadritos en total</strong>
            </p>
          </div>

          <div className="flex gap-2 mt-3">
            {(['10x6', '12x5', '20x3'] as const).map(dim => (
              <button
                key={dim}
                type="button"
                onClick={() => setActiveRect(dim)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                  activeRect === dim
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-800 flex justify-between text-indigo-950 dark:text-indigo-200 font-mono">
            <span>Área: <strong>{currentRect.area} u²</strong></span>
            <span>Perímetro: <strong className="text-indigo-600 dark:text-indigo-400">{currentRect.perimeter} lados</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
