import React from 'react';

export const IntegrationVisualizer: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-around gap-6">
        <svg width="280" height="150" viewBox="0 0 280 150">
          {/* Square ABCD */}
          <polygon
            points="30,120 110,120 110,40 30,40"
            fill="#e0e7ff"
            stroke="#4338ca"
            strokeWidth="2"
          />

          {/* Parallelogram BECD sharing side BC */}
          <polygon
            points="110,120 190,120 110,40 30,40"
            fill="none"
            stroke="#ea580c"
            strokeWidth="2"
            strokeDasharray="4"
          />
          {/* Shaded triangle BCE on the right */}
          <polygon
            points="110,120 190,120 110,40"
            fill="#ffedd5"
            stroke="#ea580c"
            strokeWidth="2"
          />

          {/* Vertex Labels */}
          <text x="20" y="125" fill="#1e293b" fontSize="12" fontWeight="bold">A</text>
          <text x="105" y="135" fill="#1e293b" fontSize="12" fontWeight="bold">B</text>
          <text x="105" y="32" fill="#1e293b" fontSize="12" fontWeight="bold">C</text>
          <text x="20" y="32" fill="#1e293b" fontSize="12" fontWeight="bold">D</text>
          <text x="195" y="125" fill="#ea580c" fontSize="12" fontWeight="bold">E</text>

          {/* Dimension 4cm */}
          <line x1="110" y1="128" x2="190" y2="128" stroke="#ea580c" strokeWidth="1.5" />
          <text x="150" y="142" textAnchor="middle" fill="#ea580c" fontSize="11" fontWeight="bold">4 cm</text>
        </svg>

        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 max-w-sm">
          <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Actividad de Integración (Pág. 211)
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            El cuadrado ABCD y el paralelogramo BECD comparten la misma base (b = 4 cm) y la misma altura (h = 4 cm).
          </p>
          <div className="space-y-1 font-mono text-slate-700 dark:text-slate-300">
            <div>• Área Cuadrado ABCD = 4 × 4 = <strong>16 cm²</strong></div>
            <div>• Área Paralelogramo BECD = 4 × 4 = <strong>16 cm²</strong></div>
          </div>
          <div className="pt-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            Conclusión: Ambos tienen la misma área porque el área solo depende de base y altura perpendicular.
          </div>
        </div>
      </div>
    </div>
  );
};
