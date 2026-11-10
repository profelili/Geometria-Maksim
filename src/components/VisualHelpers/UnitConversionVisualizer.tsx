import React, { useState } from 'react';

const UNITS = [
  { key: 'km2', label: 'km²', factorToM2: 1_000_000, name: 'Kilómetro cuadrado' },
  { key: 'hm2', label: 'hm² (ha)', factorToM2: 10_000, name: 'Hectómetro cuadrado / Hectárea' },
  { key: 'dam2', label: 'dam²', factorToM2: 100, name: 'Decámetro cuadrado' },
  { key: 'm2', label: 'm²', factorToM2: 1, name: 'Metro cuadrado (Unidad Base SI)' },
  { key: 'dm2', label: 'dm²', factorToM2: 0.01, name: 'Decímetro cuadrado' },
  { key: 'cm2', label: 'cm²', factorToM2: 0.0001, name: 'Centímetro cuadrado' },
  { key: 'mm2', label: 'mm²', factorToM2: 0.000001, name: 'Milímetro cuadrado' }
];

export const UnitConversionVisualizer: React.FC = () => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m2');
  const [toUnit, setToUnit] = useState<string>('cm2');

  const source = UNITS.find(u => u.key === fromUnit) || UNITS[3];
  const target = UNITS.find(u => u.key === toUnit) || UNITS[5];

  const inM2 = (Number(inputValue) || 0) * source.factorToM2;
  const result = inM2 / target.factorToM2;

  const formattedResult = result >= 10000 ? result.toLocaleString('es-AR') : result.toString().replace('.', ',');

  return (
    <div className="space-y-4">
      {/* Visual Decimal Ladder */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
          <span>Escala de Superficies (cada escalón multiplica o divide por 100)</span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">1 ha = 10.000 m²</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {UNITS.map(u => (
            <div
              key={u.key}
              className={`p-1.5 rounded-lg border text-center transition ${
                u.key === fromUnit
                  ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-bold'
                  : u.key === toUnit
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-[11px] font-bold">{u.label}</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono truncate">
                {u.factorToM2 >= 1 ? u.factorToM2.toLocaleString('es-AR') : u.factorToM2}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Step-by-Step Converter */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-center font-bold text-sm"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold"
          >
            {UNITS.map(u => (
              <option key={u.key} value={u.key}>{u.label}</option>
            ))}
          </select>
          <span className="text-slate-400 font-bold">=</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-base">
            {formattedResult}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold"
          >
            {UNITS.map(u => (
              <option key={u.key} value={u.key}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
