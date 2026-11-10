import React from 'react';

interface MathKeyboardProps {
  onInsert: (char: string) => void;
  onBackspace: () => void;
  onClose: () => void;
}

export const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert, onBackspace, onClose }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ',', '.', '3,14', 'π', 'cm²', 'm²', 'ha'];

  return (
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-2xl max-w-lg w-[96%] animate-slide-up">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          Teclado Rápido para Respuestas Matemáticas:
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1 font-bold"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onInsert(k)}
            className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition flex items-center justify-center shadow-xs"
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          onClick={onBackspace}
          className="col-span-2 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 active:scale-95 transition flex items-center justify-center shadow-xs"
        >
          ⌫ Borrar
        </button>
      </div>
    </div>
  );
};
