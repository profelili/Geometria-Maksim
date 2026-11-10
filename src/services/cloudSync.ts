import { UserProgress, TeacherRecord, Language, TextSize } from '../types';

const PROGRESS_STORAGE_KEY = 'perimetro_area_progress_v2';
const TEACHER_RECORDS_KEY = 'perimetro_area_teacher_records_v2';

export const initialProgress: UserProgress = {
  profile: {
    name: 'Estudiante',
    course: '7mo A',
    avatar: '🧑‍🎓',
    id: `student_${Date.now()}`,
    createdAt: new Date().toISOString()
  },
  answers: {},
  streakCount: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoal: 5,
  dailyGoalProgress: 0,
  weeklyActivity: [
    { date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], exercisesCompleted: 2, timeSpentMinutes: 10 },
    { date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], exercisesCompleted: 3, timeSpentMinutes: 15 },
    { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], exercisesCompleted: 4, timeSpentMinutes: 20 },
    { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], exercisesCompleted: 5, timeSpentMinutes: 25 },
    { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], exercisesCompleted: 4, timeSpentMinutes: 18 },
    { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], exercisesCompleted: 6, timeSpentMinutes: 28 },
    { date: new Date().toISOString().split('T')[0], exercisesCompleted: 1, timeSpentMinutes: 8 }
  ],
  unlockedAchievements: ['ach_first_correct'],
  theme: 'light',
  language: 'es',
  textSize: 'normal',
  highContrast: false,
  cloudSyncEnabled: true,
  lastCloudSync: new Date().toISOString()
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return initialProgress;
    const parsed = JSON.parse(raw);
    return { ...initialProgress, ...parsed };
  } catch (e) {
    console.warn('LocalStorage unavailable or restricted:', e);
    return initialProgress;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed saving to localStorage:', e);
  }
}

export function loadTeacherRecords(): TeacherRecord[] {
  try {
    const raw = localStorage.getItem(TEACHER_RECORDS_KEY);
    if (!raw) {
      // Seed initial dummy records for teacher view demonstration
      const demoRecords: TeacherRecord[] = [
        {
          id: 'rec_1',
          studentName: 'Lucas Benítez',
          studentCourse: '7mo A',
          avatar: '🚀',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          scoreOutOf10: 9.5,
          correctCount: 28,
          totalAnswered: 30,
          totalExercises: 30,
          percentage: 93
        },
        {
          id: 'rec_2',
          studentName: 'Camila Rossi',
          studentCourse: '7mo B',
          avatar: '🦉',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          scoreOutOf10: 10,
          correctCount: 30,
          totalAnswered: 30,
          totalExercises: 30,
          percentage: 100
        },
        {
          id: 'rec_3',
          studentName: 'Mateo Fernández',
          studentCourse: '7mo A',
          avatar: '🤖',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          scoreOutOf10: 8.0,
          correctCount: 24,
          totalAnswered: 30,
          totalExercises: 30,
          percentage: 80
        }
      ];
      localStorage.setItem(TEACHER_RECORDS_KEY, JSON.stringify(demoRecords));
      return demoRecords;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed reading teacher records:', e);
    return [];
  }
}

export function saveTeacherRecord(record: TeacherRecord): void {
  try {
    const records = loadTeacherRecords();
    const updated = [record, ...records.filter(r => r.id !== record.id)];
    localStorage.setItem(TEACHER_RECORDS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed writing teacher records:', e);
  }
}

export function calculateDailyStreak(currentStreak: number, lastDate: string): { newStreak: number; newDate: string } {
  const today = new Date().toISOString().split('T')[0];
  if (lastDate === today) {
    return { newStreak: currentStreak, newDate: today };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastDate === yesterday) {
    return { newStreak: currentStreak + 1, newDate: today };
  }

  return { newStreak: 1, newDate: today };
}

export function exportProgressAsJSON(progress: UserProgress): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute('href', dataStr);
  dlAnchorElem.setAttribute('download', `progreso_geometria_7mo_${progress.profile.name.replace(/\s+/g, '_')}.json`);
  dlAnchorElem.click();
}

export function exportTeacherRecordsAsCSV(records: TeacherRecord[]): void {
  const headers = ['Estudiante', 'Curso/Division', 'Fecha y Hora', 'Aciertos', 'Total Respondidos', 'Porcentaje', 'Nota Final (sobre 10)'];
  const rows = records.map(r => [
    `"${r.studentName}"`,
    `"${r.studentCourse}"`,
    `"${new Date(r.timestamp).toLocaleString('es-AR')}"`,
    r.correctCount,
    r.totalAnswered,
    `${r.percentage}%`,
    r.scoreOutOf10
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `planilla_calificaciones_7mo_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
}

export async function requestDailyNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('¡Geometría 7mo!', {
        body: '¡Notificaciones activadas! Te recordaremos practicar para mantener tu racha.',
        icon: '📐'
      });
      return true;
    }
  } catch (e) {
    console.error('Notification error:', e);
  }
  return false;
}
