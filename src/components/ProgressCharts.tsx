import React from 'react';
import { UserProgress, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { modulesData } from '../data/exercisesData';
import { Award, CheckCircle, Clock } from 'lucide-react';

interface ProgressChartsProps {
  progress: UserProgress;
  language: Language;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ progress, language }) => {
  const t = (k: string, p?: Record<string, string | number>) => getTranslation(language, k, p);

  // Calculate mastery per module
  const moduleMastery = modulesData.map((m) => {
    const total = m.exercises.length;
    const correct = m.exercises.filter(
      (ex) => progress.answers[ex.id] && progress.answers[ex.id].isCorrect
    ).length;
    const percentage = Math.round((correct / total) * 100);
    return {
      id: m.id,
      title: t(m.titleKey),
      total,
      correct,
      percentage
    };
  });

  // Calculate global stats
  const allExercises = modulesData.flatMap((m) => m.exercises);
  const totalExercises = allExercises.length;
  const totalCorrect = allExercises.filter(
    (ex) => progress.answers[ex.id] && progress.answers[ex.id].isCorrect
  ).length;
  const answeredCount = Object.keys(progress.answers).length;
  const globalPercentage = Math.round((totalCorrect / totalExercises) * 100);
  const estimatedGrade = Math.max(1, Math.round((totalCorrect / totalExercises) * 100) / 10);

  // Weekly stats
  const totalWeeklyMinutes = progress.weeklyActivity.reduce((acc, curr) => acc + curr.timeSpentMinutes, 0);
  const totalWeeklyExercises = progress.weeklyActivity.reduce((acc, curr) => acc + curr.exercisesCompleted, 0);
  const maxWeeklyExercises = Math.max(1, ...progress.weeklyActivity.map((d) => d.exercisesCompleted));

  return (
    <div className="space-y-6">
      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            {t('current_score')}
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {estimatedGrade}
            </span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            {t('exercises_completed')}
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {totalCorrect}
            </span>
            <span className="text-xs text-slate-400">/ {totalExercises}</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            {t('accuracy_rate')}
          </div>
          <div className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {answeredCount > 0 ? Math.round((totalCorrect / answeredCount) * 100) : 0}%
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            {t('overall_progress')}
          </div>
          <div className="font-display text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {globalPercentage}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Mastery Visual Bar Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-indigo-500" />
              <span>{t('domain_mastery')}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {totalCorrect}/{totalExercises} aciertos
            </span>
          </div>

          <div className="space-y-3">
            {moduleMastery.map((m) => (
              <div key={m.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[260px]">
                    {m.title}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums text-[11px]">
                    {m.correct}/{m.total} ({m.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      m.percentage === 100
                        ? 'bg-emerald-500'
                        : m.percentage > 50
                        ? 'bg-indigo-600'
                        : m.percentage > 0
                        ? 'bg-amber-500'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Interactive Bar Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{t('weekly_activity')}</span>
              </h3>
              <div className="text-xs text-slate-500 font-mono">
                {totalWeeklyMinutes} min · {totalWeeklyExercises} ex
              </div>
            </div>

            {/* Weekly Bars */}
            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100 dark:border-slate-800">
              {progress.weeklyActivity.map((day, idx) => {
                const dayDate = new Date(day.date);
                const dayName = dayDate.toLocaleDateString(language === 'en' ? 'en-US' : language === 'pt' ? 'pt-BR' : language === 'ru' ? 'ru-RU' : 'es-AR', { weekday: 'short' });
                const heightPct = Math.round((day.exercisesCompleted / maxWeeklyExercises) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition tabular-nums">
                      {day.exercisesCompleted}
                    </span>
                    <div
                      className="w-full max-w-[28px] bg-indigo-500/80 group-hover:bg-indigo-600 rounded-t-md transition-all duration-300"
                      style={{ height: `${Math.max(12, heightPct)}%` }}
                    />
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                      {dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Constancia diaria registrada</span>
            </span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              Meta: {progress.dailyGoal} ejercicios/día
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
