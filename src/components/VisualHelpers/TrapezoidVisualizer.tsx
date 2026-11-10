import React, { useState } from 'react';

export const TrapezoidVisualizer: React.FC = () => {
  const [strategy, setStrategy] = useState<'josefina' | 'pedro'>('josefina');

  // Specs: B = 12, b = 8, h = 7 -> Area = (12+8)*7/2 = 70
  const B = 12;
  const b = 8;
  const h = 7;
  const area = ((B + b) * h) / 2;

  return (
    <div className="space-y-4">
      {/* Strategy Switcher */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStrategy('josefina')}
          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
            strategy === 'josefina'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          Método de Josefina (2 Triángulos)
        </button>
        <button
          type="button"
          onClick={() => setStrategy('pedro')}
          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
            strategy === 'pedro'
              ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          Método de Pedro (Rectángulo + 2 Triángulos)
        </button>
      </div>

      {/* SVG Canvas */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-around gap-6">
        <svg width="280" height="130" viewBox="0 0 280 130">
          {strategy === 'josefina' ? (
            <>
              {/* Josefina: Triangle 1 (Base B = 12) */}
              <polygon points="30,105 230,105 170,25" fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
              {/* Josefina: Triangle 2 (Base b = 8) */}
              <polygon points="70,25 170,25 30,105" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
              {/* Diagonal line */}
              <line x1="30" y1="105" x2="170" y2="25" stroke="#475569" strokeWidth="1.5" strokeDasharray="3" />
            </>
          ) : (
            <>
              {/* Pedro: Left Triangle */}
              <polygon points="30,105 70,105 70,25" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
              {/* Pedro: Central Rectangle */}
              <rect x="70" y="25" width="100" height="80" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              {/* Pedro: Right Triangle */}
              <polygon points="170,25 170,105 230,105" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
            </>
          )}

          {/* Height line */}
          <line x1="70" y1="25" x2="70" y2="105" stroke="#dc2626" strokeWidth="2" strokeDasharray="4" />
          <text x="75" y="65" fill="#dc2626" fontSize="12" fontWeight="bold">h = 7 cm</text>

          {/* Top Base b */}
          <text x="120" y="18" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">b = 8 cm</text>

          {/* Bottom Base B */}
          <text x="130" y="122" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">B = 12 cm</text>
        </svg>

        {/* Calculation Details */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 max-w-sm">
          <div className="font-bold text-slate-800 dark:text-slate-100">
            {strategy === 'josefina' ? 'Razonamiento de Josefina:' : 'Razonamiento de Pedro:'}
          </div>
          {strategy === 'josefina' ? (
            <div className="space-y-1 text-slate-600 dark:text-slate-300 font-mono">
              <p>• Triángulo Rosa: (12 × 7) ÷ 2 = 42 cm²</p>
              <p>• Triángulo Verde: (8 × 7) ÷ 2 = 28 cm²</p>
              <p className="font-bold text-rose-700 dark:text-rose-300">Suma total = 42 + 28 = 70 cm²</p>
            </div>
          ) : (
            <div className="space-y-1 text-slate-600 dark:text-slate-300 font-mono">
              <p>• Rectángulo Central: 8 × 7 = 56 cm²</p>
              <p>• Triángulos Laterales juntos: (4 × 7) ÷ 2 = 14 cm²</p>
              <p className="font-bold text-sky-700 dark:text-sky-300">Suma total = 56 + 14 = 70 cm²</p>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
            Fórmula unificada: <code className="text-indigo-600 dark:text-indigo-400">A = ((B + b) × h) ÷ 2 = {area} cm²</code>
          </div>
        </div>
      </div>
    </div>
  );
};
