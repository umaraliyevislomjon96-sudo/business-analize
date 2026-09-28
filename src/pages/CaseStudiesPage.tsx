import { useState } from 'react';
import { caseStudies } from '../data/sharedData';

export default function CaseStudiesPage() {
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">📋 Case Studies</h1>
        <p className="page-subtitle">
          Решай реальные бизнес-кейсы из Retail и Banking. Исследуй данные, формулируй гипотезы,
          находи инсайты и предлагай решения.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {caseStudies.map(cs => (
          <div key={cs.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Banner */}
            <div style={{
              height: 6,
              background: cs.type === 'retail'
                ? 'linear-gradient(90deg, var(--color-retail), var(--color-retail-dark))'
                : 'linear-gradient(90deg, var(--color-banking), var(--color-banking-dark))'
            }} />

            <div style={{ padding: 'var(--space-6)' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className={`badge ${cs.type === 'retail' ? 'badge-retail' : 'badge-banking'}`}>
                      {cs.type === 'retail' ? '🛒 Retail' : '🏦 Banking'}
                    </span>
                    <span className={`difficulty ${cs.difficulty}`}>
                      <span className="difficulty-dot" /> {cs.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">⏱ {cs.duration}</span>
                  </div>
                  <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-navy-900)' }}>
                    {cs.title}
                  </h3>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveCase(activeCase === cs.id ? null : cs.id)}
                >
                  {activeCase === cs.id ? 'Свернуть' : 'Открыть кейс'}
                </button>
              </div>

              {/* Scenario */}
              <div className="case-scenario">
                <h3>📋 Сценарий</h3>
                <p>{cs.scenario}</p>
              </div>

              {activeCase === cs.id && (
                <>
                  {/* Dataset */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>📁 Доступные данные</h4>
                    <p className="text-sm text-gray-600">{cs.dataset}</p>
                  </div>

                  {/* Investigation Areas */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>🔍 Области исследования</h4>
                    <ul style={{ paddingLeft: 18 }}>
                      {cs.investigationAreas.map(area => (
                        <li key={area} className="text-sm text-gray-600" style={{ marginBottom: 4 }}>{area}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Task */}
                  <div style={{ marginBottom: 20, padding: '16px 20px', background: 'var(--color-cyan-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cyan-100)' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>🎯 Задание</h4>
                    <p style={{ fontWeight: 600, color: 'var(--color-navy-900)', fontSize: 'var(--font-size-base)' }}>{cs.task}</p>
                  </div>

                  {/* Analytical Approach */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>📐 Рекомендуемый подход</h4>
                    <ol style={{ paddingLeft: 18 }}>
                      {cs.analyticalApproach.map((step, i) => (
                        <li key={i} className="text-sm text-gray-600" style={{ marginBottom: 4 }}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Solution (hidden by default) */}
                  <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: 16, marginTop: 16 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowSolution(prev => ({ ...prev, [cs.id]: !prev[cs.id] }))}
                    >
                      {showSolution[cs.id] ? '🔒 Скрыть решение' : '📖 Показать решение'}
                    </button>

                    {showSolution[cs.id] && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ marginBottom: 16, padding: '16px 20px', background: 'var(--color-success-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-100)' }}>
                          <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-success-600)' }}>✅ Пример решения</h4>
                          <p className="text-sm" style={{ lineHeight: 1.7, color: 'var(--color-gray-700)' }}>{cs.exampleSolution}</p>
                        </div>

                        <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>💡 Ключевые инсайты</h4>
                        <ul style={{ paddingLeft: 18 }}>
                          {cs.keyInsights.map((insight, i) => (
                            <li key={i} className="text-sm text-gray-600" style={{ marginBottom: 6, lineHeight: 1.6 }}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
