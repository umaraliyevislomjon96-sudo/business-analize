import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roadmapLevels } from '../data/sharedData';
import { useProgress } from '../context/ProgressContext';

export default function RoadmapPage() {
  const navigate = useNavigate();
  const {
    progress,
    startLevel,
    resetLevel,
    resetProgressToZero,
    toggleFreeMode,
    toggleTopic,
    isTopicCompleted,
  } = useProgress();

  const [confirmReset, setConfirmReset] = useState(false);
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<number | null>(null);

  // Mini-tools states for Level 0 and Level 2
  // Level 0: P&L Unit Economics Calculator
  const [unitPrice, setUnitPrice] = useState<number>(500);
  const [unitCost, setUnitCost] = useState<number>(280);
  const [salesVolume, setSalesVolume] = useState<number>(1200);
  const [fixedCosts, setFixedCosts] = useState<number>(150000);

  // Level 2: A/B Test Calculator
  const [sampleA, setSampleA] = useState<number>(5000);
  const [convA, setConvA] = useState<number>(180);
  const [sampleB, setSampleB] = useState<number>(5000);
  const [convB, setConvB] = useState<number>(230);

  // Calculations for Level 0
  const grossRevenue = unitPrice * salesVolume;
  const totalVariableCost = unitCost * salesVolume;
  const grossProfit = grossRevenue - totalVariableCost;
  const grossMarginPct = grossRevenue > 0 ? ((grossProfit / grossRevenue) * 100).toFixed(1) : '0';
  const operatingProfit = grossProfit - fixedCosts;
  const breakEvenUnits = (unitPrice - unitCost) > 0 ? Math.ceil(fixedCosts / (unitPrice - unitCost)) : 0;

  // Calculations for Level 2
  const crA = sampleA > 0 ? (convA / sampleA) * 100 : 0;
  const crB = sampleB > 0 ? (convB / sampleB) * 100 : 0;
  const crDiff = crB - crA;
  const crLift = crA > 0 ? ((crDiff / crA) * 100).toFixed(1) : '0';
  const isSignificant = Math.abs(crDiff) > 0.6; // Simplified z-score threshold indication

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="page-title">🗺️ Learning Roadmap</h1>
            <p className="page-subtitle">
              Пошаговый путь от новичка до Junior/Middle Business Analyst. Ты можешь изучать с нуля или свободно выбрать любой уровень для повторения.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className={`btn btn-sm ${progress.freeMode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={toggleFreeMode}
              title="Переключение между свободным режимом и последовательным прохождением"
            >
              {progress.freeMode ? '🔓 Свободный доступ (Включен)' : '🔒 Поэтапный режим'}
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

        {/* Quick Level Selector Bar */}
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
              🎯 Выбрать уровень для повторения:
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>
              Текущий: Level {progress.currentLevel}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {roadmapLevels.map((lvl) => (
              <button
                key={lvl.level}
                onClick={() => startLevel(lvl.level)}
                className={`btn btn-sm ${progress.currentLevel === lvl.level ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  minWidth: 36,
                  padding: '4px 10px',
                  fontWeight: progress.currentLevel === lvl.level ? 700 : 500,
                }}
              >
                L{lvl.level}
              </button>
            ))}
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
              ⚠️ Сбросить обучение и начать с нуля?
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-gray-600)', marginBottom: 20, lineHeight: 1.6 }}>
              Все пройденные уроки, решенные задачи в SQL и Excel, а также прогресс будут сброшены до 0%.
              Вы начнете с самого начала (Уровень 0: Основы бизнеса).
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

      {/* Roadmap Levels List */}
      <div className="roadmap-container">
        <div className="roadmap-line" />
        {roadmapLevels.map((level) => {
          const isCurrent = progress.currentLevel === level.level;
          const isPassed = progress.currentLevel > level.level;
          const isUnlocked = progress.freeMode || level.level <= progress.currentLevel;

          const levelStatusClass = isPassed ? 'completed' : isCurrent ? 'current' : isUnlocked ? 'available' : 'locked';

          // Count topics done in this level
          const completedInThisLevel = level.topics.filter(t => isTopicCompleted(t)).length;

          return (
            <div key={level.level} className={`roadmap-level ${levelStatusClass}`}>
              <div className="roadmap-dot" onClick={() => startLevel(level.level)} style={{ cursor: 'pointer' }}>
                {isPassed ? '✓' : level.level}
              </div>

              <div className="roadmap-card" style={{ borderLeft: isCurrent ? '4px solid var(--color-cyan-500)' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div className="roadmap-level-label">Level {level.level}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {isCurrent && <span className="badge badge-cyan">▶ Текущий уровень</span>}
                    {isPassed && <span className="badge badge-success">✓ Завершен</span>}
                    {isUnlocked && !isCurrent && !isPassed && <span className="badge badge-retail">🔓 Доступен</span>}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6, color: 'var(--color-navy-900)' }}>
                  {level.title}
                </h3>
                <p className="card-description" style={{ marginBottom: 12 }}>
                  {level.description}
                </p>

                {/* Practice description */}
                {'practice' in level && level.practice && (
                  <div className="case-scenario" style={{ marginTop: 8, marginBottom: 12, padding: '10px 14px' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>
                      <strong>📝 Практика:</strong> {level.practice}
                    </p>
                  </div>
                )}

                {/* Interactive Topics Checklist */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="text-xs font-semibold text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Темы уровня ({completedInThisLevel}/{level.topics.length} изучено):
                    </span>
                    <span className="text-xs text-gray-400">Нажми на тему, чтобы отметить</span>
                  </div>

                  <div className="roadmap-topics">
                    {level.topics.map((topic) => {
                      const done = isTopicCompleted(topic);
                      return (
                        <span
                          key={topic}
                          className={`topic-tag ${done ? 'active' : ''}`}
                          onClick={() => toggleTopic(topic)}
                          style={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: done ? 'rgba(16, 185, 129, 0.15)' : undefined,
                            borderColor: done ? 'var(--color-success-500)' : undefined,
                            color: done ? 'var(--color-success-600)' : undefined,
                          }}
                        >
                          <span>{done ? '✓' : '○'}</span>
                          <span>{topic}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons for this Level */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: '1px solid var(--color-gray-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {/* Action button specific to level */}
                    {level.level === 0 && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveInteractiveTool(activeInteractiveTool === 0 ? null : 0)}
                      >
                        📊 {activeInteractiveTool === 0 ? 'Скрыть калькулятор P&L' : 'Калькулятор Unit Economics & P&L'}
                      </button>
                    )}

                    {level.level === 1 && (
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/excel')}>
                        📗 Открыть Excel Lab (10 задач) →
                      </button>
                    )}

                    {level.level === 2 && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveInteractiveTool(activeInteractiveTool === 2 ? null : 2)}
                      >
                        📈 {activeInteractiveTool === 2 ? 'Скрыть A/B тест' : 'Калькулятор A/B тестирования'}
                      </button>
                    )}

                    {level.level === 3 && (
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/sql')}>
                        🗄️ SQL Practice →
                      </button>
                    )}

                    {level.level === 4 && (
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/metrics')}>
                        📐 Изучить DAX & KPI →
                      </button>
                    )}

                    {level.level === 6 && (
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/case-studies')}>
                        📋 Бизнес-кейсы →
                      </button>
                    )}

                    {level.level === 7 && (
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/retail')}>
                        🛒 Retail Analytics (12 модулей) →
                      </button>
                    )}

                    {level.level === 8 && (
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/banking')}>
                        🏦 Banking Analytics (12 модулей) →
                      </button>
                    )}

                    {level.level === 9 && (
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/projects')}>
                        🚀 Реальные проекты →
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => resetLevel(level.level)}
                      title="Начать этот уровень с начала для повторения"
                    >
                      🔄 Повторить этот уровень
                    </button>
                    {!isCurrent && (
                      <button
                        className="btn btn-outline-cyan btn-sm"
                        onClick={() => startLevel(level.level)}
                        style={{ border: '1px solid var(--color-cyan-500)', color: 'var(--color-cyan-600)' }}
                      >
                        Перейти сюда
                      </button>
                    )}
                  </div>
                </div>

                {/* Level 0 Interactive Tool: P&L Unit Economics */}
                {activeInteractiveTool === 0 && level.level === 0 && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 16,
                      background: 'var(--color-gray-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cyan-200)',
                    }}
                  >
                    <h4 style={{ fontWeight: 800, color: 'var(--color-navy-900)', marginBottom: 12 }}>
                      🧮 Интерактивный симулятор: P&L и Unit Economics (Level 0)
                    </h4>
                    <p className="text-sm text-gray-600" style={{ marginBottom: 16 }}>
                      Изменяй параметры цены, себестоимости и объема, чтобы увидеть, как формируется выручка, маржа и точка безубыточности:
                    </p>

                    <div className="grid-4" style={{ marginBottom: 16 }}>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Цена продажи (₽):</label>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 8px', marginTop: 4, borderRadius: 6, border: '1px solid var(--color-gray-300)' }}
                          value={unitPrice}
                          onChange={(e) => setUnitPrice(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Себестоимость единицы (₽):</label>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 8px', marginTop: 4, borderRadius: 6, border: '1px solid var(--color-gray-300)' }}
                          value={unitCost}
                          onChange={(e) => setUnitCost(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Кол-во продаж (шт):</label>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 8px', marginTop: 4, borderRadius: 6, border: '1px solid var(--color-gray-300)' }}
                          value={salesVolume}
                          onChange={(e) => setSalesVolume(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Постоянные расходы (₽):</label>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 8px', marginTop: 4, borderRadius: 6, border: '1px solid var(--color-gray-300)' }}
                          value={fixedCosts}
                          onChange={(e) => setFixedCosts(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid-4" style={{ background: 'var(--color-white)', padding: 12, borderRadius: 8, border: '1px solid var(--color-gray-200)' }}>
                      <div>
                        <div className="text-xs text-gray-500">Выручка (Revenue):</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-navy-800)' }}>
                          ₽{grossRevenue.toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Валовая прибыль (Gross Profit):</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: grossProfit >= 0 ? 'var(--color-success-600)' : 'var(--color-danger-600)' }}>
                          ₽{grossProfit.toLocaleString('ru-RU')} ({grossMarginPct}%)
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Чистая операц. прибыль:</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: operatingProfit >= 0 ? 'var(--color-success-600)' : 'var(--color-danger-600)' }}>
                          ₽{operatingProfit.toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Точка безубыточности:</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-cyan-600)' }}>
                          {breakEvenUnits} шт
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Level 2 Interactive Tool: A/B Testing Significance */}
                {activeInteractiveTool === 2 && level.level === 2 && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 16,
                      background: 'var(--color-gray-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cyan-200)',
                    }}
                  >
                    <h4 style={{ fontWeight: 800, color: 'var(--color-navy-900)', marginBottom: 12 }}>
                      📊 Интерактивный калькулятор A/B тестирования (Level 2: Statistics)
                    </h4>
                    <p className="text-sm text-gray-600" style={{ marginBottom: 16 }}>
                      Проверь, является ли разница в конверсии между контрольной группой (A) и тестовой (B) статистически значимой:
                    </p>

                    <div className="grid-4" style={{ marginBottom: 16 }}>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Размер выборки A (посетители):</label>
                        <input
                          type="number"
                          style={{ width: '100%', padding: '6px 8px', marginTop: 4, borderRadius: 6, border: '1px solid var(--color-gray-300)' }}
                          value={sampleA}
                          onChange={(e) => setSampleA(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Конверсий A (покупок/заявок):</label>
                        <input
                          type="number"
                          style={{ width: '100%', padding: '6px 8px', marginTop: 4, borderRadius: 6, border: '1px solid var(--color-gray-300)' }}
                          value={convA}
                          onChange={(e) => setConvA(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Размер выборки B:</label>
                        <input
                          type="number"
                          style={{ width: '100%', padding: '6px 8px', marginTop: 4, borderRadius: 6, border: '1px solid var(--color-gray-300)' }}
                          value={sampleB}
                          onChange={(e) => setSampleB(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Конверсий B:</label>
                        <input
                          type="number"
                          style={{ width: '100%', padding: '6px 8px', marginTop: 4, borderRadius: 6, border: '1px solid var(--color-gray-300)' }}
                          value={convB}
                          onChange={(e) => setConvB(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid-3" style={{ background: 'var(--color-white)', padding: 12, borderRadius: 8, border: '1px solid var(--color-gray-200)' }}>
                      <div>
                        <div className="text-xs text-gray-500">Конверсия A:</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-navy-800)' }}>
                          {crA.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Конверсия B:</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-cyan-600)' }}>
                          {crB.toFixed(2)}% (Лифт: {crLift}%)
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Стат. значимость (p &lt; 0.05):</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isSignificant ? 'var(--color-success-600)' : 'var(--color-warning-600)' }}>
                          {isSignificant ? '✅ Значимо (Можно внедрять!)' : '⚠️ Недостаточно данных'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
