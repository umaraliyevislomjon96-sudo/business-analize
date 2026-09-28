import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sqlExercises } from '../data/sharedData';
import { useProgress } from '../context/ProgressContext';

export default function ExercisesPage() {
  const navigate = useNavigate();
  const { progress, completeExercise, isExerciseCompleted, isExcelTaskCompleted } = useProgress();
  const [filter, setFilter] = useState<string>('all');
  const [expandedEx, setExpandedEx] = useState<number | null>(null);

  const filtered = filter === 'all' ? sqlExercises : sqlExercises.filter(e => e.difficulty === filter);

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="page-title">✏️ Practical Exercises</h1>
            <p className="page-subtitle">
              Практические задачи по SQL и формулам Excel, привязанные к бизнес-кейсам Retail и Banking.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/excel')}>
              📗 Открыть Excel Lab (10 задач)
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sql')}>
              🗄️ Открыть SQL Practice (10 задач)
            </button>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="filter-pills" style={{ marginBottom: 24 }}>
        {['all', 'beginner', 'intermediate', 'advanced'].map(f => (
          <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `Все (${sqlExercises.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Exercises List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(ex => {
          const isDone = isExerciseCompleted(ex.id);
          const isExpanded = expandedEx === ex.id;

          return (
            <div
              key={ex.id}
              className="card card-clickable"
              onClick={() => setExpandedEx(isExpanded ? null : ex.id)}
              style={{
                borderLeft: isDone ? '4px solid var(--color-success-500)' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-md)',
                      background: isDone ? 'var(--color-success-50)' : 'var(--color-cyan-50)',
                      color: isDone ? 'var(--color-success-600)' : 'var(--color-cyan-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    {isDone ? '✓' : ex.id}
                  </div>
                  <div>
                    <h4 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{ex.title}</span>
                      {isDone && <span className="badge badge-success">✓ Решено</span>}
                    </h4>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <span className={`difficulty ${ex.difficulty}`}>
                        <span className="difficulty-dot" /> {ex.difficulty}
                      </span>
                      <span className="badge badge-gray">{ex.category}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className={`btn btn-sm ${isDone ? 'btn-success' : 'btn-secondary'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      completeExercise(ex.id);
                    }}
                  >
                    {isDone ? '✓ Решено' : 'Отметить решенным'}
                  </button>
                  <span className="text-sm text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-gray-100)' }}>
                  <div style={{ marginBottom: 12 }}>
                    <h5 style={{ fontWeight: 700, marginBottom: 4, color: 'var(--color-navy-800)' }}>📝 Задание</h5>
                    <p className="text-sm text-gray-600">{ex.task}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <h5 style={{ fontWeight: 700, marginBottom: 4, color: 'var(--color-navy-800)' }}>💡 Подсказка</h5>
                    <p className="text-sm text-gray-500">{ex.hint}</p>
                  </div>
                  <div>
                    <h5 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>📖 Решение</h5>
                    <div className="code-block">
                      <div className="code-header">
                        <span className="code-lang">SQL</span>
                      </div>
                      <div className="code-body">
                        <pre>{ex.solution}</pre>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="text-xs text-gray-500">Expected:</span>
                      {ex.expectedColumns.map(c => (
                        <span key={c} className="badge badge-cyan">{c}</span>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/sql');
                      }}
                    >
                      Решить в SQL Sandbox →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
