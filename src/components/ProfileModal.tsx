import React, { useState } from 'react';
import { StudentProfile, Language, UserProgress } from '../types';
import { getTranslation } from '../i18n/translations';
import { X, Cloud, Download, Upload, Check } from 'lucide-react';
import { exportProgressAsJSON } from '../services/cloudSync';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  language: Language;
  progress: UserProgress;
  onImportProgress: (imported: UserProgress) => void;
}

const AVATARS = ['🧑‍🎓', '📐', '🚀', '🦉', '🤖', '🟩', '🧩', '🦄', '🎨', '🌟', '🍕', '🏆'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  language,
  progress,
  onImportProgress
}) => {
  const [name, setName] = useState(profile.name);
  const [course, setCourse] = useState(profile.course);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = (k: string, p?: Record<string, string | number>) => getTranslation(language, k, p);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || 'Estudiante',
      course,
      avatar
    });
    onClose();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.answers) {
          onImportProgress(parsed);
          setImportError(null);
          onClose();
        } else {
          setImportError('El archivo no tiene el formato válido de progreso.');
        }
      } catch (err) {
        setImportError('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
          {t('student_profile')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Configurá tus datos para que tus calificaciones queden registradas con tu nombre y división.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('select_avatar')}
            </label>
            <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`text-2xl p-2 rounded-lg text-center transition ${
                    avatar === emoji
                      ? 'bg-indigo-600 text-white scale-110 shadow-sm'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('student_name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('student_name_placeholder')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('student_course')}
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7mo A">{t('course_7a')}</option>
              <option value="7mo B">{t('course_7b')}</option>
              <option value="7mo C">{t('course_7c')}</option>
              <option value="7mo Única">{t('course_7u')}</option>
            </select>
          </div>

          {/* Cloud Sync indicator & backup options */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Cloud className="w-4 h-4 text-emerald-500" />
              <span>{t('cloud_synced')}</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => exportProgressAsJSON(progress)}
                title={t('export_data')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <label
                title={t('import_data')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {importError && (
            <div className="text-xs text-red-600 dark:text-red-400">
              {importError}
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('save_profile')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
