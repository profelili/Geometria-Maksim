import React, { useState } from 'react';

export const CircleVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ring' | 'pizza' | 'rink'>('pizza');

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('pizza')}
          className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold transition ${
            activeTab === 'pizza'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          🍕 Comparador de Pizzas (30 cm vs 2 de 20 cm)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rink')}
          className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold transition ${
            activeTab === 'rink'
              ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-900 dark:text-sky-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          ⛸️ Pista de Patinaje y Espacio Libre
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ring')}
          className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold transition ${
            activeTab === 'ring'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-900 dark:text-indigo-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          💍 Anillo de Ana (Perímetro C = π·d)
        </button>
      </div>

      {/* PIZZA COMPARISON TAB */}
      {activeTab === 'pizza' && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-around gap-6">
          <div className="flex items-center gap-6">
            {/* 1 Pizza of 30cm */}
            <div className="flex flex-col items-center">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="55" fill="#fed7aa" stroke="#ea580c" strokeWidth="4" />
                <circle cx="65" cy="65" r="48" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" strokeDasharray="3" />
                <line x1="10" y1="65" x2="120" y2="65" stroke="#9a3412" strokeWidth="1.5" />
                <text x="65" y="60" textAnchor="middle" fill="#9a3412" fontSize="10" fontWeight="bold">d = 30 cm</text>
              </svg>
              <div className="text-center mt-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">1 Pizza de 30 cm</div>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Área: 706,5 cm²</div>
              </div>
            </div>

            <div className="text-lg font-bold text-slate-400">VS</div>

            {/* 2 Pizzas of 20cm */}
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                <svg width="65" height="65" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="#fed7aa" stroke="#ea580c" strokeWidth="3" />
                  <circle cx="35" cy="35" r="22" fill="#fef08a" />
                </svg>
                <svg width="65" height="65" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="#fed7aa" stroke="#ea580c" strokeWidth="3" />
                  <circle cx="35" cy="35" r="22" fill="#fef08a" />
                </svg>
              </div>
              <div className="text-center mt-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">2 Pizzas de 20 cm</div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 font-bold">Área: 628 cm²</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 max-w-sm">
            <div className="font-bold text-amber-800 dark:text-amber-300 text-sm">
              ¡La de 30 cm tiene mayor superficie!
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              El área crece con el cuadrado del radio (r²):
            </p>
            <div className="font-mono text-slate-700 dark:text-slate-300 space-y-1">
              <div>• 1 de 30 cm (r=15): 3,14 × 15² = <strong>706,5 cm²</strong></div>
              <div>• 2 de 20 cm (r=10): 2 × (3,14 × 10²) = <strong>628 cm²</strong></div>
            </div>
            <div className="pt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              Diferencia: ¡78,5 cm² más de pizza por el mismo diámetro total!
            </div>
          </div>
        </div>
      )}

      {/* SKATING RINK TAB */}
      {activeTab === 'rink' && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-around gap-6">
          <svg width="180" height="180" viewBox="0 0 180 180" className="border-2 border-slate-700 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 shadow">
            {/* Square 50x50 */}
            <rect x="10" y="10" width="160" height="160" fill="#d1fae5" stroke="#059669" strokeWidth="2" />
            {/* Inscribed rink (radius = 25m, diameter = 50m) */}
            <circle cx="90" cy="90" r="80" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="90" cy="90" r="3" fill="#0369a1" />
            {/* Radius line */}
            <line x1="90" y1="90" x2="170" y2="90" stroke="#0369a1" strokeWidth="2" />
            <text x="125" y="85" fill="#0369a1" fontSize="11" fontWeight="bold">r = 25 m</text>
            <text x="90" y="125" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">Pista</text>
          </svg>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 max-w-sm">
            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Cálculo del Espacio Libre Exterior:
            </div>
            <div className="space-y-1 font-mono text-slate-700 dark:text-slate-300">
              <p>• Terreno cuadrado: 50 × 50 = <strong>2.500 m²</strong></p>
              <p>• Pista circular: 3,14 × 25² = <strong>1.962,5 m²</strong></p>
              <p className="font-bold text-sky-700 dark:text-sky-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                Superficie libre = 2.500 - 1.962,5 = <strong>537,5 m²</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RING TAB */}
      {activeTab === 'ring' && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-around gap-6">
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="50" fill="none" stroke="#f59e0b" strokeWidth="8" />
            <circle cx="75" cy="75" r="46" fill="none" stroke="#d97706" strokeWidth="1" />
            <circle cx="75" cy="75" r="54" fill="none" stroke="#d97706" strokeWidth="1" />
            <line x1="25" y1="75" x2="125" y2="75" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" />
            <text x="75" y="70" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">d = 3 cm</text>
          </svg>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 max-w-sm">
            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Perímetro del Anillo de Ana:
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              La longitud del contorno circular se obtiene multiplicando el número π por el diámetro (d):
            </p>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800 font-mono text-indigo-900 dark:text-indigo-200">
              C = π × d = 3,14 × 3 = <strong className="text-base text-indigo-600 dark:text-indigo-400">9,42 cm</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
