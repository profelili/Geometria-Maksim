import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, StudentProfile, Language, TextSize, TeacherRecord } from './types';
import { modulesData } from './data/exercisesData';
import {
  loadUserProgress,
  saveUserProgress,
  loadTeacherRecords,
  saveTeacherRecord,
  calculateDailyStreak
} from './services/cloudSync';
import { getTranslation } from './i18n/translations';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { DailyGoalCard } from './components/DailyGoalCard';
import { ProgressCharts } from './components/ProgressCharts';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { MathKeyboard } from './components/MathKeyboard';
import { ModuleView } from './components/ModuleView';
import confetti from 'canvas-confetti';
import { Send, RotateCcw, CheckCircle2, Cloud } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [teacherRecords, setTeacherRecords] = useState<TeacherRecord[]>(loadTeacherRecords);
  const [currentTab, setCurrentTab] = useState<'modules' | 'progress' | 'daily' | 'teacher'>('modules');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [showMathKeyboard, setShowMathKeyboard] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [examModalOpen, setExamModalOpen] = useState<boolean>(false);
  const [lastExamScore, setLastExamScore] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Math keyboard active input ref
  const activeInputSetterRef = useRef<((val: string) => void) | null>(null);
  const activeInputValueRef = useRef<string>('');

  const t = (k: string, p?: Record<string, string | number>) => getTranslation(progress.language, k, p);

  // Sync dark class on <html> element
  useEffect(() => {
    if (progress.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress.theme]);

  // Daily streak check on initial load
  useEffect(() => {
    const { newStreak, newDate } = calculateDailyStreak(progress.streakCount, progress.lastActiveDate);
    if (newStreak !== progress.streakCount || newDate !== progress.lastActiveDate) {
      const updated = {
        ...progress,
        streakCount: newStreak,
        lastActiveDate: newDate
      };
      setProgress(updated);
      saveUserProgress(updated);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    const updated: UserProgress = {
      ...progress,
      profile: newProfile
    };
    setProgress(updated);
    saveUserProgress(updated);
    showToast('Perfil actualizado correctamente');
  };

  const handleImportProgress = (imported: UserProgress) => {
    setProgress(imported);
    saveUserProgress(imported);
    showToast('¡Progreso importado con éxito!');
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert(t('speech_not_supported'));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = progress.language === 'en' ? 'en-US' : progress.language === 'pt' ? 'pt-BR' : progress.language === 'ru' ? 'ru-RU' : 'es-AR';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Math keyboard insertion
  const handleKeyboardInsert = (char: string) => {
    if (activeInputSetterRef.current) {
      const newVal = activeInputValueRef.current + char;
      activeInputValueRef.current = newVal;
      activeInputSetterRef.current(newVal);
    }
  };

  const handleKeyboardBackspace = () => {
    if (activeInputSetterRef.current) {
      const newVal = activeInputValueRef.current.slice(0, -1);
      activeInputValueRef.current = newVal;
      activeInputSetterRef.current(newVal);
    }
  };

  const handleActiveInputFocus = (setter: (val: string) => void, currentVal: string) => {
    activeInputSetterRef.current = setter;
    activeInputValueRef.current = currentVal;
  };

  // Submit single answer
  const handleAnswerSubmit = (exerciseId: string, answer: string, isCorrect: boolean) => {
    const prevAnswer = progress.answers[exerciseId];
    const newAttempts = (prevAnswer?.attempts || 0) + 1;

    const newAnswers = {
      ...progress.answers,
      [exerciseId]: {
        exerciseId,
        userAnswer: answer,
        isCorrect,
        attempts: newAttempts,
        lastAttemptAt: new Date().toISOString()
      }
    };

    // Update daily goal if newly correct
    let newGoalProgress = progress.dailyGoalProgress;
    if (isCorrect && !prevAnswer?.isCorrect) {
      newGoalProgress += 1;
      // Confetti burst for correct answer
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 }
      });
    }

    // Check achievements
    const unlocked = [...progress.unlockedAchievements];
    if (isCorrect && !unlocked.includes('ach_first_correct')) {
      unlocked.push('ach_first_correct');
    }
    if (exerciseId.startsWith('p198') && !unlocked.includes('ach_pentamino_master')) {
      unlocked.push('ach_pentamino_master');
    }
    if (exerciseId.startsWith('p204') && !unlocked.includes('ach_parallelogram')) {
      unlocked.push('ach_parallelogram');
    }
    if (exerciseId.startsWith('p206') && !unlocked.includes('ach_trapezoid')) {
      unlocked.push('ach_trapezoid');
    }
    if (exerciseId.startsWith('p209') || exerciseId.startsWith('p210')) {
      if (!unlocked.includes('ach_circle')) unlocked.push('ach_circle');
    }

    const updated: UserProgress = {
      ...progress,
      answers: newAnswers,
      dailyGoalProgress: newGoalProgress,
      unlockedAchievements: unlocked,
      lastCloudSync: new Date().toISOString()
    };

    setProgress(updated);
    saveUserProgress(updated);
  };

  // Submit entire exam & grade
  const handleSubmitExam = () => {
    const allExercises = modulesData.flatMap((m) => m.exercises);
    const totalCount = allExercises.length;
    const correctCount = allExercises.filter(
      (ex) => progress.answers[ex.id] && progress.answers[ex.id].isCorrect
    ).length;

    const rawScore = (correctCount / totalCount) * 10;
    const finalScore = Math.max(1, Math.round(rawScore * 10) / 10);
    const percentage = Math.round((correctCount / totalCount) * 100);

    setLastExamScore(finalScore);

    const record: TeacherRecord = {
      id: `rec_${Date.now()}`,
      studentName: progress.profile.name,
      studentCourse: progress.profile.course,
      avatar: progress.profile.avatar,
      timestamp: new Date().toISOString(),
      scoreOutOf10: finalScore,
      correctCount,
      totalAnswered: Object.keys(progress.answers).length,
      totalExercises: totalCount,
      percentage
    };

    saveTeacherRecord(record);
    setTeacherRecords(loadTeacherRecords());

    // Celebrate!
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });

    setExamModalOpen(true);
  };

  // Reset worksheet
  const handleResetAnswers = () => {
    if (window.confirm('¿Deseás reiniciar tus respuestas para practicar nuevamente?')) {
      const updated: UserProgress = {
        ...progress,
        answers: {},
        dailyGoalProgress: 0
      };
      setProgress(updated);
      saveUserProgress(updated);
      showToast('Respuestas reiniciadas para una nueva práctica.');
    }
  };

  // Text size classes
  const textSizeClass =
    progress.textSize === 'large'
      ? 'text-lg leading-relaxed'
      : progress.textSize === 'xlarge'
      ? 'text-xl leading-loose'
      : 'text-base';

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors ${textSizeClass} ${progress.highContrast ? 'contrast-125' : ''}`}>
      {/* Top Navigation Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={progress.language}
        setLanguage={(l) => {
          const upd = { ...progress, language: l };
          setProgress(upd);
          saveUserProgress(upd);
        }}
        theme={progress.theme}
        setTheme={(th) => {
          const upd = { ...progress, theme: th };
          setProgress(upd);
          saveUserProgress(upd);
        }}
        profile={progress.profile}
        openProfileModal={() => setIsProfileModalOpen(true)}
        streakCount={progress.streakCount}
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
        {/* Accessibility Bar */}
        <AccessibilityToolbar
          textSize={progress.textSize}
          setTextSize={(sz) => {
            const upd = { ...progress, textSize: sz };
            setProgress(upd);
            saveUserProgress(upd);
          }}
          highContrast={progress.highContrast}
          setHighContrast={(hc) => {
            const upd = { ...progress, highContrast: hc };
            setProgress(upd);
            saveUserProgress(upd);
          }}
          isSpeaking={isSpeaking}
          stopSpeaking={stopSpeaking}
          showMathKeyboard={showMathKeyboard}
          setShowMathKeyboard={setShowMathKeyboard}
          language={progress.language}
        />

        {/* Tab 1: Modules and Exercises */}
        {currentTab === 'modules' && (
          <div className="space-y-6">
            <ModuleView
              modules={modulesData}
              progress={progress}
              onAnswerSubmit={handleAnswerSubmit}
              onSpeak={speakText}
              language={progress.language}
              onActiveInputFocus={handleActiveInputFocus}
            />

            {/* Submit & Reset Bar */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">
                  ¿Terminaste de resolver los ejercicios?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Podés entregar tu práctica para calcular tu nota final y registrarla en la planilla docente.
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetAnswers}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('reset_answers')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('submit_exam')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Progress & Analytics */}
        {currentTab === 'progress' && (
          <ProgressCharts progress={progress} language={progress.language} />
        )}

        {/* Tab 3: Daily Goal, Streak & Badges */}
        {currentTab === 'daily' && (
          <DailyGoalCard
            progress={progress}
            language={progress.language}
            onUpdateDailyGoal={(newGoal) => {
              const upd = { ...progress, dailyGoal: newGoal };
              setProgress(upd);
              saveUserProgress(upd);
            }}
          />
        )}

        {/* Tab 4: Teacher Gradebook Dashboard */}
        {currentTab === 'teacher' && (
          <TeacherDashboard records={teacherRecords} language={progress.language} />
        )}
      </main>

      {/* Virtual Math Keyboard */}
      {showMathKeyboard && (
        <MathKeyboard
          onInsert={handleKeyboardInsert}
          onBackspace={handleKeyboardBackspace}
          onClose={() => setShowMathKeyboard(false)}
        />
      )}

      {/* Student Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={progress.profile}
        onSaveProfile={handleSaveProfile}
        language={progress.language}
        progress={progress}
        onImportProgress={handleImportProgress}
      />

      {/* Exam Result Modal */}
      {examModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <span className="text-5xl block mb-2">{progress.profile.avatar}</span>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              ¡Práctica Entregada!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {progress.profile.name} · {progress.profile.course}
            </p>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 mb-4">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                Tu Nota Estimada
              </span>
              <div className="font-display text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 my-1 tabular-nums">
                {lastExamScore} <span className="text-xl text-emerald-400">/ 10</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-center space-x-1.5 mb-5">
              <Cloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Registrado en el Panel Docente y en la nube.</span>
            </div>

            <button
              type="button"
              onClick={() => setExamModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition"
            >
              Continuar practicando
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-lg text-xs flex items-center space-x-2 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
