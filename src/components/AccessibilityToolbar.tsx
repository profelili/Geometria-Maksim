import React from 'react';
import { TextSize, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { Volume2, VolumeX, Eye, Keyboard } from 'lucide-react';

interface AccessibilityToolbarProps {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  showMathKeyboard: boolean;
  setShowMathKeyboard: (val: boolean) => void;
  language: Language;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  textSize,
  setTextSize,
  highContrast,
  setHighContrast,
  isSpeaking,
  stopSpeaking,
  showMathKeyboard,
  setShowMathKeyboard,
  language
}) => {
  const t = (k: string) => getTranslation(language, k);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
      {/* Text Size Control */}
      <div className="flex items-center space-x-1">
        <span className="text-[11px] text-slate-500 font-semibold mr-1">{t('text_size')}:</span>
        <button
          type="button"
          onClick={() => setTextSize('normal')}
          className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
            textSize === 'normal'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          A
        </button>
        <button
          type="button"
          onClick={() => setTextSize('large')}
          className={`px-2 py-0.5 rounded text-sm font-semibold transition ${
            textSize === 'large'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => setTextSize('xlarge')}
          className={`px-2 py-0.5 rounded text-base font-bold transition ${
            textSize === 'xlarge'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          A++
        </button>
      </div>

      <div className="flex items-center space-x-2">
        {/* Text-to-Speech active indicator / stopper */}
        {isSpeaking && (
          <button
            type="button"
            onClick={stopSpeaking}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-500 text-white font-bold animate-pulse text-[11px]"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>{t('stop_reading')}</span>
          </button>
        )}

        {/* Math Keyboard Toggle */}
        <button
          type="button"
          onClick={() => setShowMathKeyboard(!showMathKeyboard)}
          title="Teclado numérico y matemático rápido"
          className={`flex items-center space-x-1 px-2.5 py-1 rounded border text-[11px] font-semibold transition ${
            showMathKeyboard
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Teclado Matemático</span>
        </button>

        {/* High Contrast Toggle */}
        <button
          type="button"
          onClick={() => setHighContrast(!highContrast)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded border text-[11px] font-semibold transition ${
            highContrast
              ? 'bg-yellow-400 text-slate-900 border-yellow-500 font-bold'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t('high_contrast')}</span>
        </button>
      </div>
    </div>
  );
};
