import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { roadmapLevels } from '../data/sharedData';

export default function ProgressPage() {
  const navigate = useNavigate();
  const {
    progress,
    resetProgressToZero,
    startLevel,
    resetLevel,
    toggleFreeMode,
  } = useProgress();

  const [confirmReset, setConfirmReset] = useState(false);

  const skillBars = [
    { label: 'Excel (Тренажер формул)', value: progress.skills.excel, color: 'var(--color-success-500)', link: '/excel' },
    { label: 'SQL (Практика запросов)', value: progress.skills.sql, color: 'var(--color-cyan-500)', link: '/sql' },
    { label: 'Power BI & DAX', value: progress.skills.powerbi, color: 'var(--color-warning-500)', link: '/metrics' },
    { label: 'Python & Аналитика', value: progress.skills.python, color: 'var(--color-retail)', link: '/roadmap' },
    { label: 'Retail Analytics', value: progress.skills.retail, color: 'var(--color-retail)', link: '/retail' },
    { label: 'Banking Analytics', value: progress.skills.banking, color: 'var(--color-banking)', link: '/banking' },
  ];

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="page-title">📊 Мой прогресс обучения</h1>
            <p className="page-subtitle">
              Отслеживай свои навыки, пройденные уровни и достижения. Ты можешь в любой момент начать с нуля или выбрать любой уровень для повторения.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${progress.freeMode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={toggleFreeMode}
            >
              {progress.freeMode ? '🔓 Свободный режим (Вкл)' : '🔒 Поэтапный режим'}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--color-danger-600)', borderColor: 'var(--color-danger-500)' }}
              onClick={() => setConfirmReset(true)}
            >
              🔄 Начать с нуля
            </button>
          </div>
        </div>

        {/* Level Switcher & Replay Bar */}
        <div
          style={{
            marginTop: 18,
            padding: '12px 16px',
            background: 'var(--color-white)',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy-800)' }}>
              🎯 Текущий уровень для обучения/повторения:
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>
              Level {progress.currentLevel}: {roadmapLevels[progress.currentLevel]?.title || 'Основы'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="text-xs text-gray-500">Сменить:</span>
            {roadmapLevels.map(lvl => (
              <button
                key={lvl.level}
                onClick={() => startLevel(lvl.level)}
                className={`btn btn-sm ${progress.currentLevel === lvl.level ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minWidth: 32, padding: '3px 8px' }}
              >
                L{lvl.level}
              </button>
            ))}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => resetLevel(progress.currentLevel)}
              title="Сбросить прогресс текущего уровня и пройти его заново"
            >
              🔄 Повторить этот уровень
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmReset && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 480,
              width: '90%',
              padding: 24,
              boxShadow: 'var(--shadow-xl)',
              background: 'var(--color-white)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: 'var(--color-navy-900)' }}>
              ⚠️ Начать обучение с самого нуля?
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-gray-600)', marginBottom: 20, lineHeight: 1.6 }}>
              Это действие сбросит весь прогресс до 0% (Уровень 0), обнулит выполненные уроки и задания в Excel и SQL.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmReset(false)}>
                Отмена
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  resetProgressToZero();
                  setConfirmReset(false);
                }}
              >
                Да, начать с нуля
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Stats */}
      <div className="dashboard-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-card-label">Общий прогресс</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-cyan-600)', lineHeight: 1 }}>
            {progress.overallProgress}%
          </div>
          <div className="progress-bar mt-2">
            <div className="progress-bar-fill" style={{ width: `${progress.overallProgress}%` }} />
          </div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-card-label">Текущий уровень</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-navy-800)', lineHeight: 1 }}>
            Level {progress.currentLevel}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {roadmapLevels[progress.currentLevel]?.title || 'Основы'}
          </div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-card-label">Learning Streak</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-warning-600)', lineHeight: 1 }}>
            🔥 {progress.learningStreak}
          </div>
          <div className="text-sm text-gray-500 mt-2">дней активности</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-card-label">Часов обучения</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-navy-800)', lineHeight: 1 }}>
            {progress.totalHoursLearned}h
          </div>
          <div className="text-sm text-gray-500 mt-2">практики и теории</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Skills */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="card-title">🎯 Навыки и тренажеры</h3>
            <span className="text-xs text-gray-400">Растут по мере практики</span>
          </div>

          {skillBars.map(skill => (
            <div key={skill.label} style={{ marginBottom: 16 }}>
              <div className="progress-text">
                <span className="progress-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{skill.label}</span>
                  <a href={`#${skill.link}`} className="text-xs" style={{ color: 'var(--color-cyan-600)' }}>
                    ↗ перейти
                  </a>
                </span>
                <span className="progress-value">{skill.value}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${skill.value}%`, background: skill.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Learning Statistics */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 className="card-title" style={{ marginBottom: 16 }}>📚 Статистика выполнения</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="lesson-meta-item">
                <span className="label">Пройдено модулей теории:</span>
                <span className="font-semibold">{progress.completedLessonIds.length} / 24</span>
              </div>
              <div className="lesson-meta-item">
                <span className="label">Решено задач в Excel Lab:</span>
                <span className="font-semibold" style={{ color: 'var(--color-success-600)' }}>
                  {progress.completedExcelTaskIds.length} / 10
                </span>
              </div>
              <div className="lesson-meta-item">
                <span className="label">Решено задач в SQL Practice:</span>
                <span className="font-semibold" style={{ color: 'var(--color-cyan-600)' }}>
                  {progress.completedExerciseIds.length} / 10
                </span>
              </div>
              <div className="lesson-meta-item">
                <span className="label">Изучено тем на Roadmap:</span>
                <span className="font-semibold">{progress.completedTopics.length} тем</span>
              </div>
              <div className="lesson-meta-item">
                <span className="label">Максимальный балл тестов:</span>
                <span className="font-semibold">{progress.quizScore}%</span>
              </div>
            </div>
          </div>

          {/* Quick Action Suggestion */}
          <div className="card" style={{ background: 'var(--color-cyan-50)', borderColor: 'var(--color-cyan-100)' }}>
            <h3 className="card-title" style={{ marginBottom: 8 }}>💡 Рекомендованное действие</h3>
            <p className="text-sm text-gray-600" style={{ marginBottom: 12 }}>
              {progress.skills.excel < 30 ? (
                <>
                  <strong>Практика в Excel Lab:</strong> Потренируйся в решении 10 практических бизнес-задач с живыми формулами SUM, AVERAGE, IF и XLOOKUP.
                </>
              ) : progress.skills.sql < 30 ? (
                <>
                  <strong>Практика SQL:</strong> Напиши свои первые аналитические SQL запросы для анализа клиентской базы и продаж.
                </>
              ) : (
                <>
                  <strong>Изучение специализации:</strong> Пройди отраслевые модули Retail или Banking Analytics.
                </>
              )}
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(progress.skills.excel < 30 ? '/excel' : progress.skills.sql < 30 ? '/sql' : '/roadmap')}
            >
              Перейти к практике →
            </button>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <section className="section" style={{ marginTop: 32 }}>
        <h2 className="section-title" style={{ marginBottom: 16 }}>🏅 Достижения</h2>
        <div className="grid-4">
          {progress.achievements.map(badge => (
            <div
              key={badge.id}
              className={`achievement-badge ${badge.earned ? 'earned' : ''}`}
              style={{
                opacity: badge.earned ? 1 : 0.5,
                border: badge.earned ? '1px solid var(--color-cyan-400)' : '1px solid var(--color-gray-200)',
                background: badge.earned ? 'rgba(6, 182, 212, 0.06)' : undefined,
              }}
            >
              <span className="achievement-icon">{badge.icon}</span>
              <div className="achievement-info">
                <h5>{badge.name}</h5>
                <p>{badge.description}</p>
                {badge.earned ? (
                  <span className="text-xs" style={{ color: 'var(--color-success-600)', fontWeight: 600 }}>✓ Разблокировано</span>
                ) : (
                  <span className="text-xs text-gray-400">🔒 В процессе</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
