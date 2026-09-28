import React from 'react';
import { useNavigate } from 'react-router-dom';
import { retailModules } from '../data/retailData';
import { bankingModules } from '../data/bankingData';
import { useProgress } from '../context/ProgressContext';
import { roadmapLevels } from '../data/sharedData';

export default function HomePage() {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const currentLevelInfo = roadmapLevels[progress.currentLevel] || roadmapLevels[0];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ Интерактивная платформа обучения бизнес-аналитике</div>
          <h1>
            Business Analytics <span className="accent">Academy</span>
          </h1>
          <p className="hero-description">
            Научись превращать данные в бизнес-решения в Retail и Banking.
            От основ бизнеса, формул Excel и SQL до реальных отраслевых кейсов и проектов.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/roadmap')}>
              {progress.overallProgress > 0 ? `Продолжить Level ${progress.currentLevel} →` : 'Начать обучение с нуля →'}
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/excel')}>
              📗 Открыть Excel Lab
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/roadmap')}>
              🗺️ Roadmap ({roadmapLevels.length} уровней)
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">10</div>
              <div className="hero-stat-label">Уровней Roadmap</div>
            </div>
            <div>
              <div className="hero-stat-value">10</div>
              <div className="hero-stat-label">Задач Excel Lab</div>
            </div>
            <div>
              <div className="hero-stat-value">10</div>
              <div className="hero-stat-label">SQL Задач</div>
            </div>
            <div>
              <div className="hero-stat-value">24</div>
              <div className="hero-stat-label">Отраслевых Модуля</div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Dynamic Progress Overview */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Твой прогресс обучения</h2>
            <p className="section-subtitle">
              {progress.overallProgress === 0
                ? 'Ты в самом начале пути! Выбери уровень или начни с Уровня 0 (Основы бизнеса).'
                : `Ты на Уровне ${progress.currentLevel}: ${currentLevelInfo.title}.`}
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/progress')}>
            Управление прогрессом →
          </button>
        </div>

        <div className="grid-4">
          <div className="stat-card">
            <div className="stat-card-label">Общий прогресс</div>
            <div className="stat-card-value">{progress.overallProgress}%</div>
            <div className="progress-bar mt-2">
              <div className="progress-bar-fill" style={{ width: `${progress.overallProgress}%` }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">Текущий уровень</div>
            <div className="stat-card-value">Level {progress.currentLevel}</div>
            <div className="stat-card-change positive">{currentLevelInfo.title}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">Excel & SQL задачи</div>
            <div className="stat-card-value">
              {progress.completedExcelTaskIds.length + progress.completedExerciseIds.length} / 20
            </div>
            <div className="stat-card-change positive">Решено практики</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">Learning Streak</div>
            <div className="stat-card-value">
              <span className="streak-display">🔥 {progress.learningStreak} дн.</span>
            </div>
            <div className="stat-card-change positive">Режим обучения активен</div>
          </div>
        </div>
      </section>

      {/* Key Interactive Tools Section */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Интерактивные тренажеры и инструменты</h2>
            <p className="section-subtitle">Практикуйся на реальных данных без ограничений</p>
          </div>
        </div>

        <div className="grid-4">
          {[
            {
              icon: '📗',
              title: 'Excel Lab',
              desc: 'Интерактивная таблица, 10 бизнес-задач (SUM, IF, XLOOKUP, DTI, маржа)',
              to: '/excel',
              color: 'success',
              badge: '10 задач',
            },
            {
              icon: '🗄️',
              title: 'SQL Practice',
              desc: 'Песочница с базами данных Retail и Banking, 10 реальных задач',
              to: '/sql',
              color: 'cyan',
              badge: '10 задач',
            },
            {
              icon: '🗺️',
              title: 'Learning Roadmap',
              desc: '10 уровней с нуля: свободный выбор любого уровня для повторения',
              to: '/roadmap',
              color: 'navy',
              badge: 'Level 0-9',
            },
            {
              icon: '❓',
              title: 'Тесты & Квизы',
              desc: 'Проверь знания по метрикам, SQL, анализу данных и бизнес-логике',
              to: '/quizzes',
              color: 'warning',
              badge: '20 вопросов',
            },
          ].map(item => (
            <div key={item.title} className="card card-clickable" onClick={() => navigate(item.to)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className={`card-icon ${item.color}`}>{item.icon}</div>
                <span className="badge badge-gray">{item.badge}</span>
              </div>
              <h4 className="card-title" style={{ marginTop: 12 }}>{item.title}</h4>
              <p className="card-description">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Отраслевые специализации</h2>
            <p className="section-subtitle">Два направления для глубокого погружения в бизнес-аналитику</p>
          </div>
        </div>
        <div className="grid-2">
          <div className="spec-card retail" onClick={() => navigate('/retail')}>
            <div className="spec-card-icon">🛒</div>
            <h3>Retail Business Analytics</h3>
            <p>
              Анализ продаж, клиентов, товаров, магазинов, запасов, цен,
              промоакций и прибыльности розничной торговли.
            </p>
            <div className="spec-card-topics">
              {['Sales Analytics', 'Customer Analytics', 'Product Analytics', 'Inventory', 'Pricing', 'Promotions', 'RFM', 'CLV', 'Store Performance', 'Segmentation'].map(t => (
                <span key={t} className="topic-tag">{t}</span>
              ))}
            </div>
            <div className="card-footer">
              <span className="badge badge-retail">{retailModules.length} модулей</span>
              <span className="text-sm text-gray-500">~40 часов</span>
            </div>
          </div>

          <div className="spec-card banking" onClick={() => navigate('/banking')}>
            <div className="spec-card-icon">🏦</div>
            <h3>Banking Analytics</h3>
            <p>
              Анализ клиентов, транзакций, кредитов, депозитов, рисков
              и банковских продуктов.
            </p>
            <div className="spec-card-topics">
              {['Customer Analytics', 'Transaction Analytics', 'Credit Risk', 'Fraud', 'Deposits', 'Loans', 'Churn', 'CLV', 'Portfolio', 'Profitability'].map(t => (
                <span key={t} className="topic-tag">{t}</span>
              ))}
            </div>
            <div className="card-footer">
              <span className="badge badge-banking">{bankingModules.length} модулей</span>
              <span className="text-sm text-gray-500">~45 часов</span>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Path Preview */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Путь развития (10 уровней с нуля)</h2>
            <p className="section-subtitle">Нажми на любой шаг, чтобы перейти к уровню</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/roadmap')}>
            Весь Roadmap →
          </button>
        </div>
        <div className="learning-path" style={{ overflowX: 'auto', paddingBottom: 12 }}>
          {roadmapLevels.map((lvl, i, arr) => {
            const isCompleted = progress.currentLevel > lvl.level;
            const isCurrent = progress.currentLevel === lvl.level;
            return (
              <span key={lvl.level} style={{ display: 'contents' }}>
                <div
                  className={`learning-path-step ${isCompleted ? 'completed' : ''}`}
                  onClick={() => navigate('/roadmap')}
                  style={{
                    cursor: 'pointer',
                    borderColor: isCurrent ? 'var(--color-cyan-500)' : undefined,
                    boxShadow: isCurrent ? '0 0 0 2px var(--color-cyan-500)' : undefined,
                  }}
                >
                  <div className="learning-path-icon">
                    {lvl.level === 0 ? '🏢' : lvl.level === 1 ? '📗' : lvl.level === 2 ? '📊' : lvl.level === 3 ? '🗄️' : lvl.level === 4 ? '📈' : lvl.level === 5 ? '🐍' : lvl.level === 6 ? '💼' : lvl.level === 7 ? '🛒' : lvl.level === 8 ? '🏦' : '🚀'}
                  </div>
                  <div className="learning-path-label" style={{ fontWeight: isCurrent ? 700 : 500 }}>
                    L{lvl.level}: {lvl.title}
                  </div>
                </div>
                {i < arr.length - 1 && <span className="learning-path-arrow">→</span>}
              </span>
            );
          })}
        </div>
      </section>
    </>
  );
}
