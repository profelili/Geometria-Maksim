import React, { useState } from 'react';

export const RhomboidVisualizer: React.FC = () => {
  const [showHalves, setShowHalves] = useState<boolean>(true);

  // Julia's paper sheet: 45 x 63 -> Area max = 45 * 63 / 2 = 1417.5 cm²
  const D = 63;
  const d = 45;
  const rectArea = D * d;
  const kiteArea = rectArea / 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          El Barrilete de Julia y el Rectángulo Envolvente
        </span>
        <button
          type="button"
          onClick={() => setShowHalves(!showHalves)}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1 rounded-lg transition"
        >
          {showHalves ? 'Ocultar Triángulos Exteriores' : 'Ver Comparación de Mitades'}
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-around gap-6">
        <svg width="240" height="170" viewBox="0 0 240 170" className="overflow-visible">
          {/* Bounding Rectangle */}
          <rect
            x="20"
            y="15"
            width="200"
            height="140"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4"
          />

          {/* 4 Outer Triangles (if showHalves is true) */}
          {showHalves && (
            <>
              <polygon points="20,15 120,15 120,60" fill="#fee2e2" opacity="0.6" />
              <polygon points="120,15 220,15 120,60" fill="#fee2e2" opacity="0.6" />
              <polygon points="20,155 120,155 120,60" fill="#fee2e2" opacity="0.6" />
              <polygon points="120,155 220,155 120,60" fill="#fee2e2" opacity="0.6" />
            </>
          )}

          {/* Kite (Romboide) */}
          <polygon
            points="120,15 220,60 120,155 20,60"
            fill="#fed7aa"
            stroke="#ea580c"
            strokeWidth="2.5"
          />

          {/* Major Diagonal D */}
          <line x1="120" y1="15" x2="120" y2="155" stroke="#0284c7" strokeWidth="2" />
          <text x="125" y="90" fill="#0284c7" fontSize="12" fontWeight="bold">D = 63 cm</text>

          {/* Minor Diagonal d */}
          <line x1="20" y1="60" x2="220" y2="60" stroke="#0284c7" strokeWidth="2" />
          <text x="60" y="52" fill="#0284c7" fontSize="12" fontWeight="bold">d = 45 cm</text>
        </svg>

        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 max-w-sm">
          <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Propiedad de las Diagonales:
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Las diagonales dividen al rectángulo en 4 pares de triángulos rectángulos idénticos.
          </p>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
            <p>• Área del pliego rectangular: 63 × 45 = <strong>{rectArea} cm²</strong></p>
            <p>• Área máxima del barrilete: {rectArea} ÷ 2 = <strong className="text-sm font-bold text-orange-600 dark:text-orange-400">{kiteArea.toString().replace('.', ',')} cm²</strong></p>
          </div>
          <div className="font-mono text-slate-700 dark:text-slate-300 font-bold pt-1">
            Fórmula: <code className="text-indigo-600 dark:text-indigo-400">Área = (D × d) ÷ 2</code>
          </div>
        </div>
      </div>
    </div>
  );
};
