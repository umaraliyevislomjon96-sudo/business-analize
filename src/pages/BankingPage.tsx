import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bankingModules, bankingKPIs } from '../data/bankingData';
import { useProgress } from '../context/ProgressContext';

export default function BankingPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toggleLesson, isLessonCompleted } = useProgress();

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">🏦 Banking Analytics</h1>
        <p className="page-subtitle">
          Анализ клиентов, транзакций, кредитных рисков, депозитов, антифрода и банковских продуктов.
        </p>
        <div className="page-meta">
          <span className="badge badge-banking">{bankingModules.length} модулей</span>
          <span className="badge badge-gray">~45 часов</span>
          <span className="difficulty beginner"><span className="difficulty-dot" /> Beginner → Advanced</span>
        </div>
      </div>

      {/* KPI Overview */}
      <section className="section">
        <h2 className="section-title">Ключевые Banking KPI (Интерактивные данные)</h2>
        <div className="dashboard-grid" style={{ marginTop: 16 }}>
          {bankingKPIs.map(kpi => (
            <div key={kpi.name} className="stat-card">
              <div className="stat-card-label">{kpi.name}</div>
              <div className="stat-card-value">{kpi.value}</div>
              <div className={`stat-card-change ${kpi.positive ? 'positive' : 'negative'}`}>
                {kpi.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Модули обучения (Banking)</h2>
          <span className="text-sm text-gray-400">Нажми на карточку для деталей или отметь галочкой</span>
        </div>

        <div className="grid-2">
          {bankingModules.map((mod) => {
            const isCompleted = isLessonCompleted(mod.id);
            return (
              <div
                key={mod.id}
                className="card card-clickable"
                onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                style={{
                  borderLeft: isCompleted ? '4px solid var(--color-success-500)' : undefined,
                }}
              >
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="card-icon banking">{mod.icon}</div>
                    <div>
                      <h4 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{mod.title}</span>
                        {isCompleted && <span className="badge badge-success">✓ Изучен</span>}
                      </h4>
                      <span className={`difficulty ${mod.difficulty}`}>
                        <span className="difficulty-dot" />
                        {mod.difficulty === 'beginner' ? 'Beginner' : mod.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-secondary'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLesson(mod.id, 'banking');
                      }}
                      title={isCompleted ? 'Отметить как неизученный' : 'Отметить как изученный'}
                    >
                      {isCompleted ? '✓ Пройдено' : '○ Отметить'}
                    </button>
                    <span className="text-sm text-gray-500">⏱ {mod.duration}</span>
                  </div>
                </div>

                <p className="card-description">{mod.description}</p>

                {/* Progress bar */}
                <div style={{ marginTop: 12 }}>
                  <div className="progress-text">
                    <span className="progress-label">Статус</span>
                    <span className="progress-value">{isCompleted ? '100%' : '0%'}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill banking"
                      style={{ width: isCompleted ? '100%' : '0%', background: isCompleted ? 'var(--color-success-500)' : undefined }}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {activeModule === mod.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-gray-100)' }}>
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ fontWeight: 700, marginBottom: 4, color: 'var(--color-navy-800)' }}>What is it?</h5>
                      <p className="text-sm text-gray-600" style={{ lineHeight: 1.7 }}>{mod.whatIsIt}</p>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ fontWeight: 700, marginBottom: 4, color: 'var(--color-navy-800)' }}>Why it matters?</h5>
                      <p className="text-sm text-gray-600" style={{ lineHeight: 1.7 }}>{mod.whyItMatters}</p>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>Key Metrics</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {mod.keyMetrics.map(m => <span key={m} className="badge badge-banking">{m}</span>)}
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>Business Questions</h5>
                      <ul style={{ paddingLeft: 18 }}>
                        {mod.businessQuestions.map(q => (
                          <li key={q} className="text-sm text-gray-600" style={{ marginBottom: 4 }}>{q}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>SQL Example</h5>
                      <div className="code-block">
                        <div className="code-header">
                          <span className="code-lang">SQL</span>
                        </div>
                        <div className="code-body">
                          <pre>{mod.sqlExample}</pre>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/lesson/${mod.id}`);
                        }}
                      >
                        Подробнее о модуле →
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/sql');
                        }}
                      >
                        🗄️ Перейти в SQL Practice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
