import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProgressData {
  overallProgress: number;
  currentLevel: number;
  freeMode: boolean; // When true, all levels can be accessed and repeated anytime
  completedLessonIds: string[];
  completedExerciseIds: number[];
  completedExcelTaskIds: number[];
  completedTopics: string[]; // Topic names marked completed
  quizScore: number;
  learningStreak: number;
  totalHoursLearned: number;
  skills: {
    excel: number;
    sql: number;
    powerbi: number;
    python: number;
    retail: number;
    banking: number;
  };
  achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
  }[];
}

const DEFAULT_ACHIEVEMENTS = [
  { id: 'first-step', name: 'Первый шаг', description: 'Начни обучение с нуля на платформе', icon: '🎯', earned: false },
  { id: 'excel-starter', name: 'Excel Практик', description: 'Реши 3 задачи в интерактивном Excel Lab', icon: '📗', earned: false },
  { id: 'excel-master', name: 'Мастер формул', description: 'Реши все задачи в Excel Lab', icon: '📊', earned: false },
  { id: 'sql-beginner', name: 'SQL Новичок', description: 'Выполни 3 SQL запроса', icon: '🗄️', earned: false },
  { id: 'sql-pro', name: 'SQL Эксперт', description: 'Реши все 10 практических SQL задач', icon: '⚡', earned: false },
  { id: 'quiz-master', name: 'Эрудит аналитики', description: 'Сдай тест с результатом от 80%', icon: '🏆', earned: false },
  { id: 'retail-explorer', name: 'Retail Аналитик', description: 'Пройди 3 модуля в Retail Analytics', icon: '🛒', earned: false },
  { id: 'banking-explorer', name: 'Banking Аналитик', description: 'Пройди 3 модуля в Banking Analytics', icon: '🏦', earned: false },
  { id: 'repeat-champion', name: 'Чемпион повторения', description: 'Повтори пройденный уровень заново', icon: '🔄', earned: false },
];

const INITIAL_PROGRESS: UserProgressData = {
  overallProgress: 0,
  currentLevel: 0, // Starts from scratch at Level 0: Business Fundamentals
  freeMode: true, // Enabled by default so user can repeat and choose ANY level freely!
  completedLessonIds: [],
  completedExerciseIds: [],
  completedExcelTaskIds: [],
  completedTopics: [],
  quizScore: 0,
  learningStreak: 1,
  totalHoursLearned: 0,
  skills: {
    excel: 0,
    sql: 0,
    powerbi: 0,
    python: 0,
    retail: 0,
    banking: 0,
  },
  achievements: DEFAULT_ACHIEVEMENTS,
};

const STORAGE_KEY = 'ba_academy_user_progress_v3';

interface ProgressContextType {
  progress: UserProgressData;
  resetProgressToZero: () => void;
  startLevel: (levelNumber: number) => void;
  resetLevel: (levelNumber: number) => void;
  toggleFreeMode: () => void;
  toggleLesson: (lessonId: string, moduleType: 'retail' | 'banking') => void;
  toggleTopic: (topicName: string) => void;
  completeExercise: (exerciseId: number) => void;
  completeExcelTask: (taskId: number) => void;
  saveQuizScore: (score: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isTopicCompleted: (topicName: string) => boolean;
  isExerciseCompleted: (exerciseId: number) => boolean;
  isExcelTaskCompleted: (taskId: number) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgressData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure default achievements exist
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          skills: { ...INITIAL_PROGRESS.skills, ...(parsed.skills || {}) },
          achievements: DEFAULT_ACHIEVEMENTS.map(a => {
            const found = (parsed.achievements || []).find((pa: any) => pa.id === a.id);
            return found ? { ...a, earned: found.earned } : a;
          }),
        };
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return INITIAL_PROGRESS;
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Helper to recalculate overall progress and achievements
  const recalculateStats = (prev: UserProgressData): UserProgressData => {
    const totalPossiblePoints = 24 + 10 + 10 + 20; // 24 modules + 10 sql + 10 excel + 20 topics
    const currentPoints =
      prev.completedLessonIds.length +
      prev.completedExerciseIds.length +
      prev.completedExcelTaskIds.length +
      Math.min(prev.completedTopics.length, 20);

    const overallPct = Math.min(100, Math.round((currentPoints / totalPossiblePoints) * 100));

    // Dynamic skills
    const excelSkill = Math.min(100, prev.completedExcelTaskIds.length * 10);
    const sqlSkill = Math.min(100, prev.completedExerciseIds.length * 10);
    const retailDone = prev.completedLessonIds.filter(id => !id.includes('bank') && !id.includes('credit') && !id.includes('fraud')).length;
    const bankingDone = prev.completedLessonIds.filter(id => id.includes('bank') || id.includes('credit') || id.includes('fraud') || id.includes('deposit') || id.includes('loan')).length;
    const retailSkill = Math.min(100, retailDone * 15);
    const bankingSkill = Math.min(100, bankingDone * 15);

    // Update achievements
    const updatedAchievements = prev.achievements.map(ach => {
      let earned = ach.earned;
      if (ach.id === 'first-step') earned = currentPoints > 0 || prev.totalHoursLearned > 0;
      if (ach.id === 'excel-starter') earned = prev.completedExcelTaskIds.length >= 3;
      if (ach.id === 'excel-master') earned = prev.completedExcelTaskIds.length >= 10;
      if (ach.id === 'sql-beginner') earned = prev.completedExerciseIds.length >= 3;
      if (ach.id === 'sql-pro') earned = prev.completedExerciseIds.length >= 10;
      if (ach.id === 'quiz-master') earned = prev.quizScore >= 80;
      if (ach.id === 'retail-explorer') earned = retailDone >= 3;
      if (ach.id === 'banking-explorer') earned = bankingDone >= 3;
      return { ...ach, earned };
    });

    const hours = Math.round((currentPoints * 0.5 + (prev.learningStreak > 1 ? prev.learningStreak * 0.3 : 0)) * 10) / 10;

    return {
      ...prev,
      overallProgress: overallPct,
      totalHoursLearned: hours,
      skills: {
        ...prev.skills,
        excel: excelSkill,
        sql: sqlSkill,
        retail: retailSkill,
        banking: bankingSkill,
      },
      achievements: updatedAchievements,
    };
  };

  const resetProgressToZero = () => {
    const fresh = {
      ...INITIAL_PROGRESS,
      achievements: DEFAULT_ACHIEVEMENTS.map(a => ({ ...a, earned: false })),
    };
    setProgress(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.error(e);
    }
  };

  const startLevel = (levelNumber: number) => {
    setProgress(prev => ({
      ...prev,
      currentLevel: levelNumber,
    }));
  };

  const resetLevel = (levelNumber: number) => {
    setProgress(prev => {
      // Mark repeating achievement
      const updatedAchievements = prev.achievements.map(a =>
        a.id === 'repeat-champion' ? { ...a, earned: true } : a
      );
      return {
        ...prev,
        currentLevel: levelNumber,
        achievements: updatedAchievements,
      };
    });
  };

  const toggleFreeMode = () => {
    setProgress(prev => ({
      ...prev,
      freeMode: !prev.freeMode,
    }));
  };

  const toggleLesson = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const nextLessons = exists
        ? prev.completedLessonIds.filter(id => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      return recalculateStats({ ...prev, completedLessonIds: nextLessons });
    });
  };

  const toggleTopic = (topicName: string) => {
    setProgress(prev => {
      const exists = prev.completedTopics.includes(topicName);
      const nextTopics = exists
        ? prev.completedTopics.filter(t => t !== topicName)
        : [...prev.completedTopics, topicName];
      return recalculateStats({ ...prev, completedTopics: nextTopics });
    });
  };

  const completeExercise = (exerciseId: number) => {
    setProgress(prev => {
      if (prev.completedExerciseIds.includes(exerciseId)) return prev;
      return recalculateStats({
        ...prev,
        completedExerciseIds: [...prev.completedExerciseIds, exerciseId],
      });
    });
  };

  const completeExcelTask = (taskId: number) => {
    setProgress(prev => {
      if (prev.completedExcelTaskIds.includes(taskId)) return prev;
      return recalculateStats({
        ...prev,
        completedExcelTaskIds: [...prev.completedExcelTaskIds, taskId],
      });
    });
  };

  const saveQuizScore = (score: number) => {
    setProgress(prev =>
      recalculateStats({
        ...prev,
        quizScore: Math.max(prev.quizScore, score),
      })
    );
  };

  const isLessonCompleted = (lessonId: string) => progress.completedLessonIds.includes(lessonId);
  const isTopicCompleted = (topicName: string) => progress.completedTopics.includes(topicName);
  const isExerciseCompleted = (exerciseId: number) => progress.completedExerciseIds.includes(exerciseId);
  const isExcelTaskCompleted = (taskId: number) => progress.completedExcelTaskIds.includes(taskId);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        resetProgressToZero,
        startLevel,
        resetLevel,
        toggleFreeMode,
        toggleLesson,
        toggleTopic,
        completeExercise,
        completeExcelTask,
        saveQuizScore,
        isLessonCompleted,
        isTopicCompleted,
        isExerciseCompleted,
        isExcelTaskCompleted,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
