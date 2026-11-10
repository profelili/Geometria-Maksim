import React, { useState } from 'react';
import { UserProgress, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { achievementsList } from '../data/exercisesData';
import { Bell, Flame, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { requestDailyNotificationPermission } from '../services/cloudSync';

interface DailyGoalCardProps {
  progress: UserProgress;
  language: Language;
  onUpdateDailyGoal: (newGoal: number) => void;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({
  progress,
  language,
  onUpdateDailyGoal
}) => {
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const t = (k: string, p?: Record<string, string | number>) => getTranslation(language, k, p);

  const goalCompleted = progress.dailyGoalProgress >= progress.dailyGoal;
  const percentage = Math.min(100, Math.round((progress.dailyGoalProgress / progress.dailyGoal) * 100));

  const handleEnableNotifications = async () => {
    const granted = await requestDailyNotificationPermission();
    if (granted) {
      setNotificationMsg(t('notifications_enabled'));
      confetti({ particleCount: 40, spread: 60 });
    } else {
      setNotificationMsg(t('notification_permission_denied'));
    }
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Daily Goal & Streak Hero Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-amber-500/5 to-purple-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shadow-inner">
              <Flame className="w-7 h-7 fill-amber-500 stroke-amber-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {t('streak')}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {t('streak_days', { count: progress.streakCount })}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ¡Resolvé ejercicios todos los días para que tu llama no se apague!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEnableNotifications}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition"
          >
            <Bell className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('enable_notifications')}</span>
          </button>
        </div>

        {notificationMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-medium">
            {notificationMsg}
          </div>
        )}

        {/* Progress Bar of Daily Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300">
              {t('daily_goal_sub', { completed: progress.dailyGoalProgress, goal: progress.dailyGoal })}
            </span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {percentage}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                goalCompleted
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-indigo-500 to-amber-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {goalCompleted && (
            <div className="pt-1 flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('daily_goal_achieved')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Badges and Achievements Grid */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-indigo-500" />
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
            {t('achievements')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievementsList.map((ach) => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-start space-x-3 transition ${
                  isUnlocked
                    ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-60'
                }`}
              >
                <span className="text-2xl p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700">
                  {ach.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {t(ach.titleKey)}
                    </span>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                    {t(ach.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
