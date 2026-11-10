import React, { useState } from 'react';
import { ModuleSection, Exercise, UserProgress, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { PentaminoVisualizer } from './VisualHelpers/PentaminoVisualizer';
import { GridUnitsVisualizer } from './VisualHelpers/GridUnitsVisualizer';
import { UnitConversionVisualizer } from './VisualHelpers/UnitConversionVisualizer';
import { PatioVisualizer } from './VisualHelpers/PatioVisualizer';
import { ParallelogramVisualizer } from './VisualHelpers/ParallelogramVisualizer';
import { TrapezoidVisualizer } from './VisualHelpers/TrapezoidVisualizer';
import { RhomboidVisualizer } from './VisualHelpers/RhomboidVisualizer';
import { CircleVisualizer } from './VisualHelpers/CircleVisualizer';
import { IntegrationVisualizer } from './VisualHelpers/IntegrationVisualizer';
import { Volume2, HelpCircle, Check, X, Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface ModuleViewProps {
  modules: ModuleSection[];
  progress: UserProgress;
  onAnswerSubmit: (exerciseId: string, answer: string, isCorrect: boolean) => void;
  onSpeak: (text: string) => void;
  language: Language;
  onActiveInputFocus: (inputSetter: (val: string) => void, currentVal: string) => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  modules,
  progress,
  onAnswerSubmit,
  onSpeak,
  language,
  onActiveInputFocus
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [expandedVisuals, setExpandedVisuals] = useState<Record<string, boolean>>({
    mod1: true,
    mod2: true,
    mod3: true,
    mod4: true,
    mod5: true,
    mod6: true,
    mod7: true,
    mod8: true
  });
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});
  const [visibleExplanations, setVisibleExplanations] = useState<Record<string, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.entries(progress.answers).forEach(([id, ans]) => {
      initial[id] = ans.userAnswer;
    });
    return initial;
  });

  const t = (k: string, p?: Record<string, string | number>) => getTranslation(language, k, p);

  const toggleVisual = (modId: string) => {
    setExpandedVisuals((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const toggleHint = (exId: string) => {
    setVisibleHints((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  const toggleExplanation = (exId: string) => {
    setVisibleExplanations((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  const handleInputChange = (exId: string, val: string) => {
    setInputValues((prev) => ({ ...prev, [exId]: val }));
  };

  const checkAnswer = (ex: Exercise) => {
    const rawVal = (inputValues[ex.id] || '').trim();
    if (!rawVal) return;

    // Normalize for comparison: remove all spaces, replace period with comma for comparison, lower-case
    const cleanRaw = rawVal.replace(/\s+/g, '').toLowerCase();

    const isMatch = ex.expectedAnswers.some((expected) => {
      const cleanExp = expected.replace(/\s+/g, '').toLowerCase();
      if (cleanRaw === cleanExp) return true;
      // also test comma / dot interchange
      if (cleanRaw.replace('.', ',') === cleanExp.replace('.', ',')) return true;
      // also test without unit suffix if present
      if (cleanRaw.replace(/[^0-9.,]/g, '') === cleanExp.replace(/[^0-9.,]/g, '')) return true;
      return false;
    });

    onAnswerSubmit(ex.id, rawVal, isMatch);
  };

  const renderVisualHelper = (visualType: string) => {
    switch (visualType) {
      case 'pentamino':
        return <PentaminoVisualizer />;
      case 'grid_units':
        return <GridUnitsVisualizer />;
      case 'conversions':
        return <UnitConversionVisualizer />;
      case 'patio':
        return <PatioVisualizer />;
      case 'parallelogram':
        return <ParallelogramVisualizer />;
      case 'trapezoid':
        return <TrapezoidVisualizer />;
      case 'rhomboid':
        return <RhomboidVisualizer />;
      case 'circle':
        return <CircleVisualizer />;
      case 'integration':
        return <IntegrationVisualizer />;
      default:
        return null;
    }
  };

  const filteredModules = selectedModuleId === 'all'
    ? modules
    : modules.filter((m) => m.id === selectedModuleId);

  return (
    <div className="space-y-6">
      {/* Module Filter Segmented Control */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          <button
            type="button"
            onClick={() => setSelectedModuleId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              selectedModuleId === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('all_modules')}
          </button>
          {modules.map((m) => {
            const isSelected = selectedModuleId === m.id;
            const completedCount = m.exercises.filter((ex) => progress.answers[ex.id]?.isCorrect).length;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModuleId(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Págs. {m.pages}</span>
                {completedCount === m.exercises.length && (
                  <span className="text-[10px] text-emerald-300">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-8">
        {filteredModules.map((mod) => {
          const isVisualOpen = expandedVisuals[mod.id] !== false;
          const completedInMod = mod.exercises.filter((ex) => progress.answers[ex.id]?.isCorrect).length;

          return (
            <section
              key={mod.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Module Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {t('module_page_label')} {mod.pages}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {completedInMod}/{mod.exercises.length} resueltos
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {t(mod.titleKey)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t(mod.subtitleKey)}
                  </p>
                </div>

                {/* Read aloud & toggle visual helper buttons */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSpeak(`${t(mod.titleKey)}. ${t(mod.subtitleKey)}`)}
                    title={t('read_aloud')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVisual(mod.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{t('interactive_visual_helper')}</span>
                    {isVisualOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Interactive Visualizer */}
              {isVisualOpen && (
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                  {renderVisualHelper(mod.visualType)}
                </div>
              )}

              {/* Exercises List inside Module */}
              <div className="p-5 space-y-4">
                {mod.exercises.map((ex) => {
                  const savedAnswer = progress.answers[ex.id];
                  const currentInput = inputValues[ex.id] || '';
                  const hasAnswered = !!savedAnswer;
                  const isCorrect = savedAnswer?.isCorrect;

                  return (
                    <div
                      key={ex.id}
                      className={`p-4 rounded-xl border transition ${
                        isCorrect
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10'
                          : hasAnswered && !isCorrect
                          ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                      }`}
                    >
                      {/* Exercise Header & Audio */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                            Ejercicio {ex.questionNumber}
                          </span>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {ex.instructionKey}
                          </p>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white pt-1">
                            {ex.promptKey}
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSpeak(`${ex.instructionKey}. ${ex.promptKey}`)}
                          title={t('read_aloud')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Input & Check Button */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <div className="relative flex-1 min-w-[160px] max-w-xs">
                          <input
                            type="text"
                            value={currentInput}
                            onFocus={() =>
                              onActiveInputFocus(
                                (val) => handleInputChange(ex.id, val),
                                currentInput
                              )
                            }
                            onChange={(e) => handleInputChange(ex.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') checkAnswer(ex);
                            }}
                            placeholder={ex.placeholder || t('input_placeholder')}
                            className={`w-full px-3.5 py-2 rounded-xl text-sm font-mono font-medium outline-none border transition ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 font-bold'
                                : hasAnswered && !isCorrect
                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100'
                                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-500 focus:bg-white'
                            }`}
                          />
                          {ex.unit && (
                            <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-mono">
                              {ex.unit}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => checkAnswer(ex)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {isCorrect ? <Check className="w-3.5 h-3.5" /> : null}
                          <span>{isCorrect ? t('correct') : t('check_answer')}</span>
                        </button>

                        {/* Hint Button */}
                        <button
                          type="button"
                          onClick={() => toggleHint(ex.id)}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 transition flex items-center space-x-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>{visibleHints[ex.id] ? t('hide_hint') : t('hint')}</span>
                        </button>

                        {/* Explanation Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleExplanation(ex.id)}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 transition flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{visibleExplanations[ex.id] ? t('hide_explanation') : t('explanation')}</span>
                        </button>
                      </div>

                      {/* Feedback Message */}
                      {hasAnswered && !isCorrect && (
                        <div className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                          <X className="w-3.5 h-3.5" />
                          <span>{t('incorrect')}</span>
                        </div>
                      )}

                      {/* Hint Content */}
                      {visibleHints[ex.id] && (
                        <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                          💡 <strong>Pista:</strong> {ex.hintKey}
                        </div>
                      )}

                      {/* Step-by-Step Explanation */}
                      {visibleExplanations[ex.id] && (
                        <div className="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
                          📐 <strong>Procedimiento Matemático:</strong> {ex.explanationKey}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
