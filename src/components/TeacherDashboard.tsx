import React, { useState } from 'react';
import { TeacherRecord, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { Download, Users, Award, BookCheck, Search } from 'lucide-react';
import { exportTeacherRecordsAsCSV } from '../services/cloudSync';

interface TeacherDashboardProps {
  records: TeacherRecord[];
  language: Language;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ records, language }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const t = (k: string, p?: Record<string, string | number>) => getTranslation(language, k, p);

  // Filter records
  const filtered = records.filter((r) => {
    const matchesCourse = selectedCourse === 'all' || r.studentCourse.includes(selectedCourse);
    const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Calculate stats
  const totalSubmissions = filtered.length;
  const avgScore = totalSubmissions > 0
    ? (filtered.reduce((acc, r) => acc + r.scoreOutOf10, 0) / totalSubmissions).toFixed(1)
    : '0.0';
  const highestScore = totalSubmissions > 0
    ? Math.max(...filtered.map((r) => r.scoreOutOf10)).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookCheck className="w-4 h-4" />
            <span>{t('nav_teacher')}</span>
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            {t('teacher_dashboard_title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('teacher_dashboard_sub')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportTeacherRecordsAsCSV(filtered)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow transition"
        >
          <Download className="w-4 h-4" />
          <span>{t('export_csv')}</span>
        </button>
      </div>

      {/* Class KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('total_submissions')}</div>
            <div className="font-display text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalSubmissions}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('class_average')}</div>
            <div className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {avgScore} <span className="text-xs text-slate-400">/ 10</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('highest_score')}</div>
            <div className="font-display text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {highestScore} <span className="text-xs text-slate-400">/ 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de alumno..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">{t('filter_course')}</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="all">{t('all_courses')}</option>
            <option value="7mo A">7mo A</option>
            <option value="7mo B">7mo B</option>
            <option value="7mo C">7mo C</option>
            <option value="7mo Única">7mo Única</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">{t('table_student')}</th>
                <th className="py-3 px-4">{t('table_course')}</th>
                <th className="py-3 px-4">{t('table_date')}</th>
                <th className="py-3 px-4 text-center">{t('table_hits')}</th>
                <th className="py-3 px-4 text-center">{t('table_percentage')}</th>
                <th className="py-3 px-4 text-right">{t('table_score')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                    {t('table_empty')}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-bold">
                      <span className="text-lg">{r.avatar}</span>
                      <span>{r.studentName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {r.studentCourse}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                      {new Date(r.timestamp).toLocaleString('es-AR')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                      {r.correctCount} / {r.totalExercises}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                      {r.percentage}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-display font-extrabold text-indigo-600 dark:text-indigo-400 text-sm font-mono tabular-nums">
                        {r.scoreOutOf10.toFixed(1)} / 10
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
