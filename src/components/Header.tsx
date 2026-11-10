import React from 'react';
import { Language, StudentProfile } from '../types';
import { getTranslation } from '../i18n/translations';
import { Sun, Moon, Globe, User, BookOpen, BarChart3, Target, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentTab: 'modules' | 'progress' | 'daily' | 'teacher';
  setCurrentTab: (tab: 'modules' | 'progress' | 'daily' | 'teacher') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  profile: StudentProfile;
  openProfileModal: () => void;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  theme,
  setTheme,
  profile,
  openProfileModal,
  streakCount
}) => {
  const t = (k: string) => getTranslation(language, k);

  const navItems = [
    { id: 'modules', label: t('nav_modules'), icon: BookOpen },
    { id: 'progress', label: t('nav_progress'), icon: BarChart3 },
    { id: 'daily', label: t('nav_daily_goal'), icon: Target },
    { id: 'teacher', label: t('nav_teacher'), icon: GraduationCap }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Wordmark Brand Zone */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentTab('modules')}
            className="text-left group flex items-center space-x-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition">
              📐
            </div>
            <div>
              <span className="font-display font-extrabold text-base md:text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-tight">
                {t('app_title')}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block leading-none">
                {t('app_subtitle')}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean, single-line text links with active indicator) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center space-x-1.5 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Streak, Language, Dark Mode & Profile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak indicator */}
          <button
            type="button"
            onClick={() => setCurrentTab('daily')}
            title={`${streakCount} días de racha`}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold transition hover:bg-amber-100"
          >
            <span>🔥</span>
            <span className="tabular-nums font-mono">{streakCount}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Seleccionar idioma"
              className="pl-6 pr-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
              <option value="pt">PT</option>
              <option value="ru">RU</option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Alternar tema"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
          </button>

          {/* Student Profile Trigger */}
          <button
            type="button"
            onClick={openProfileModal}
            className="flex items-center space-x-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 transition"
          >
            <span className="text-lg">{profile.avatar}</span>
            <div className="text-left hidden sm:block max-w-[90px] truncate">
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block truncate">
                {profile.name}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-1.5 bg-slate-50/90 dark:bg-slate-900/90 text-xs">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center space-x-1 py-1 px-2 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
