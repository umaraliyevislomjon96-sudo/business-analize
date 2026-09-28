import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { retailModules } from '../data/retailData';
import { bankingModules } from '../data/bankingData';
import { useProgress } from '../context/ProgressContext';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleLesson, isLessonCompleted } = useProgress();

  const allModules = [...retailModules, ...bankingModules];
  const mod = allModules.find(m => m.id === id);

  if (!mod) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📄</div>
        <h3>Урок не найден</h3>
        <p>Вернитесь на страницу специализации</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>На главную</button>
      </div>
    );
  }

  const isRetail = retailModules.some(m => m.id === id);
  const isCompleted = isLessonCompleted(mod.id);

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(isRetail ? '/retail' : '/banking')}>
              ← Назад к модулям
            </button>
            <span className={`badge ${isRetail ? 'badge-retail' : 'badge-banking'}`}>
              {isRetail ? '🛒 Retail' : '🏦 Banking'}
            </span>
            <span className={`difficulty ${mod.difficulty}`}>
              <span className="difficulty-dot" /> {mod.difficulty}
            </span>
          </div>

          <button
            className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-primary'}`}
            onClick={() => toggleLesson(mod.id, isRetail ? 'retail' : 'banking')}
          >
            {isCompleted ? '✓ Модуль пройден' : 'Отметить как пройденный'}
          </button>
        </div>

        <h1 className="page-title">{mod.icon} {mod.title}</h1>
        <p className="page-subtitle">{mod.description}</p>
        <div className="page-meta" style={{ marginTop: 8 }}>
          <span className="text-sm text-gray-500">⏱ {mod.duration}</span>
          <span className="text-sm text-gray-500">📝 {mod.lessonsCount} практических блоков</span>
        </div>
      </div>

      <div className="lesson-container">
        {/* Main Content */}
        <div>
          {/* What is it */}
          <div className="lesson-content-block">
            <h2>📘 Что это такое? (What is it?)</h2>
            <p>{mod.whatIsIt}</p>
          </div>

          {/* Why it matters */}
          <div className="lesson-content-block">
            <h2>🎯 Зачем это нужно бизнесу? (Why it matters?)</h2>
            <p>{mod.whyItMatters}</p>
          </div>

          {/* Key Metrics */}
          <div className="lesson-content-block">
            <h2>📐 Ключевые метрики (Key Metrics)</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {mod.keyMetrics.map(m => (
                <span key={m} className={`badge ${isRetail ? 'badge-retail' : 'badge-banking'}`} style={{ fontSize: 'var(--font-size-sm)', padding: '6px 14px' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Business Questions */}
          <div className="lesson-content-block">
            <h2>❓ Бизнес-вопросы для аналитика</h2>
            <p className="text-sm text-gray-500" style={{ marginBottom: 12 }}>
              Вопросы, на которые бизнес-аналитик должен уметь отвечать стейкхолдерам:
            </p>
            <ul className="lesson-list">
              {mod.businessQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          {/* SQL Example */}
          <div className="lesson-content-block">
            <h2>🗄️ Пример SQL-запроса</h2>
            <p className="text-sm text-gray-500" style={{ marginBottom: 12 }}>
              Практический SQL-запрос для извлечения и агрегации необходимых данных:
            </p>
            <div className="code-block">
              <div className="code-header">
                <span className="code-lang">SQL</span>
                <button className="code-copy-btn" onClick={() => navigator.clipboard?.writeText(mod.sqlExample)}>
                  📋 Скопировать
                </button>
              </div>
              <div className="code-body">
                <pre>{mod.sqlExample}</pre>
              </div>
            </div>
          </div>

          {/* Excel Application */}
          <div className="lesson-content-block">
            <h2>📗 Применение в Excel</h2>
            <div className="case-scenario" style={{ background: 'rgba(16, 185, 129, 0.06)', borderLeft: '4px solid var(--color-success-500)' }}>
              <h3 style={{ color: 'var(--color-success-600)' }}>💡 Как это рассчитывается в таблицах</h3>
              <p style={{ margin: '8px 0 0 0', lineHeight: 1.6 }}>
                {'excelExample' in mod && (mod as any).excelExample
                  ? (mod as any).excelExample
                  : 'Используй функции SUMIFS, AVERAGE, VLOOKUP/XLOOKUP и Pivot Tables для анализа показателей данного модуля в Excel.'}
              </p>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/excel')}>
                  Перейти в Excel Lab для тренировки →
                </button>
              </div>
            </div>
          </div>

          {/* Real-world example */}
          <div className="lesson-content-block">
            <h2>🏢 Бизнес-эффект и принятие решений</h2>
            <div className="case-scenario">
              <h3>💡 Реальный кейс использования</h3>
              <p>
                Этот тип анализа используется {isRetail ? 'розничными сетями' : 'банками'} ежедневно для принятия 
                операционных и стратегических решений. Аналитик готовит данные для коммерческого директора и риск-менеджеров.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-gray-200)', flexWrap: 'wrap', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => navigate(isRetail ? '/retail' : '/banking')}>
              ← Все модули {isRetail ? 'Retail' : 'Banking'}
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline-cyan" onClick={() => navigate('/sql')}>
                🗄️ Практика SQL
              </button>
              <button
                className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => toggleLesson(mod.id, isRetail ? 'retail' : 'banking')}
              >
                {isCompleted ? '✓ Модуль усвоен' : 'Отметить как пройденный'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Progress */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h4 className="card-title" style={{ marginBottom: 12 }}>📊 Статус модуля</h4>
            <div className="progress-text">
              <span className="progress-label">Прохождение</span>
              <span className="progress-value">{isCompleted ? '100%' : 'В процессе'}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{
                width: isCompleted ? '100%' : '40%',
                background: isCompleted ? 'var(--color-success-500)' : isRetail ? 'var(--color-retail)' : 'var(--color-banking)'
              }} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h4 className="card-title" style={{ marginBottom: 12 }}>🔗 Связанные тренажеры</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="#/excel" className="text-sm" style={{ color: 'var(--color-cyan-600)', textDecoration: 'none' }}>📗 Excel Interactive Lab</a>
              <a href="#/sql" className="text-sm" style={{ color: 'var(--color-cyan-600)', textDecoration: 'none' }}>🗄️ SQL Practice Sandbox</a>
              <a href="#/roadmap" className="text-sm" style={{ color: 'var(--color-cyan-600)', textDecoration: 'none' }}>🗺️ Learning Roadmap</a>
              <a href="#/metrics" className="text-sm" style={{ color: 'var(--color-cyan-600)', textDecoration: 'none' }}>📐 Business Metrics</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
