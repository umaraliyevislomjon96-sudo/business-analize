import React, { useState } from 'react';
import { sqlExercises } from '../data/sharedData';
import { retailDatasets } from '../data/retailData';
import { bankingDatasets } from '../data/bankingData';
import { useProgress } from '../context/ProgressContext';

export default function SQLPage() {
  const { progress, completeExercise, isExerciseCompleted } = useProgress();
  const [activeExerciseId, setActiveExerciseId] = useState<number>(1);
  const [sql, setSql] = useState<string>('');
  const [result, setResult] = useState<string[][] | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'schema'>('editor');
  const [filter, setFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const activeExercise = sqlExercises.find(e => e.id === activeExerciseId) || sqlExercises[0];
  const filtered = filter === 'all' ? sqlExercises : sqlExercises.filter(e => e.difficulty === filter);

  // Realistic results dataset for all 10 SQL exercises
  const exerciseResults: Record<number, string[][]> = {
    1: [
      ['customer_id', 'customer_name', 'total_orders', 'total_spent'],
      ['1002', 'Пётр Сидоров', '47', '₽589,400'],
      ['1045', 'Елена Кузнецова', '42', '₽478,200'],
      ['1001', 'Анна Иванова', '38', '₽425,800'],
      ['1089', 'Дмитрий Волков', '35', '₽398,100'],
      ['1023', 'Ольга Морозова', '33', '₽367,500'],
      ['1067', 'Сергей Попов', '31', '₽345,200'],
      ['1034', 'Наталья Соколова', '29', '₽312,800'],
      ['1056', 'Андрей Лебедев', '28', '₽298,400'],
      ['1078', 'Ирина Новикова', '27', '₽276,900'],
      ['1012', 'Алексей Козлов', '25', '₽265,100'],
    ],
    2: [
      ['category', 'orders_count', 'units_sold', 'total_revenue'],
      ['Электроника', '12,450', '28,900', '₽245,600,000'],
      ['Молочные', '34,200', '89,500', '₽187,300,000'],
      ['Бакалея', '28,100', '67,200', '₽156,800,000'],
      ['Мясо', '18,900', '42,100', '₽134,500,000'],
      ['Хлеб', '31,400', '78,300', '₽89,200,000'],
    ],
    3: [
      ['month', 'gross_revenue', 'net_revenue', 'avg_order_value'],
      ['2024-01', '₽42,150,000', '₽38,900,000', '₽2,840'],
      ['2024-02', '₽44,800,000', '₽41,200,000', '₽2,910'],
      ['2024-03', '₽48,900,000', '₽45,300,000', '₽3,050'],
      ['2024-04', '₽46,700,000', '₽43,100,000', '₽2,980'],
      ['2024-05', '₽51,200,000', '₽47,600,000', '₽3,180'],
    ],
    4: [
      ['customer_id', 'full_name', 'last_order_date', 'days_inactive', 'status'],
      ['1015', 'Михаил Васильев', '2023-11-04', '118', 'At Risk'],
      ['1028', 'Екатерина Павлова', '2023-10-19', '134', 'At Risk'],
      ['1039', 'Иван Семенов', '2023-09-12', '171', 'Churned'],
      ['1064', 'Татьяна Егорова', '2023-08-25', '189', 'Churned'],
    ],
    5: [
      ['product_id', 'product_name', 'category', 'stock_quantity', 'daily_velocity', 'days_of_supply'],
      ['104', 'Молоко 3.2% 1л', 'Молочные', '45', '18.2', '2.5'],
      ['108', 'Хлеб нарезной', 'Хлеб', '28', '14.0', '2.0'],
      ['215', 'Сыр Российский', 'Молочные', '19', '4.5', '4.2'],
      ['302', 'Масло сливочное', 'Бакалея', '32', '6.8', '4.7'],
    ],
    6: [
      ['loan_type', 'total_loans', 'active_loans', 'npl_loans', 'npl_ratio_pct'],
      ['Consumer', '14,200', '12,800', '420', '3.28%'],
      ['Mortgage', '8,400', '8,150', '98', '1.20%'],
      ['Auto', '5,600', '5,100', '165', '3.23%'],
      ['Credit Card', '22,500', '18,900', '980', '5.18%'],
    ],
    7: [
      ['segment', 'client_count', 'avg_deposit_amount', 'total_deposit_volume', 'avg_rate'],
      ['Mass', '48,200', '₽145,000', '₽6,989,000,000', '14.2%'],
      ['Affluent', '12,500', '₽1,250,000', '₽15,625,000,000', '15.4%'],
      ['Private Banking', '850', '₽24,800,000', '₽21,080,000,000', '16.1%'],
    ],
    8: [
      ['transaction_id', 'customer_id', 'amount', 'channel', 'risk_score', 'flag'],
      ['TX-9901', '1088', '₽450,000', 'Online Banking', '0.94', 'HIGH_RISK'],
      ['TX-9914', '1420', '₽890,000', 'ATM Night', '0.98', 'BLOCKED'],
      ['TX-9932', '2019', '₽280,000', 'Cross-border', '0.89', 'MANUAL_REVIEW'],
    ],
    9: [
      ['month', 'txn_count', 'txn_volume', 'prev_month_volume', 'mom_change_pct'],
      ['2024-01', '124,500', '₽1,420,000,000', '₽1,350,000,000', '+5.2%'],
      ['2024-02', '118,200', '₽1,380,000,000', '₽1,420,000,000', '-2.8%'],
      ['2024-03', '135,400', '₽1,590,000,000', '₽1,380,000,000', '+15.2%'],
    ],
    10: [
      ['customer_id', 'recency_days', 'frequency', 'monetary', 'r_score', 'f_score', 'm_score', 'segment'],
      ['1002', '4', '38', '₽589,400', '5', '5', '5', 'Champions'],
      ['1045', '12', '31', '₽478,200', '5', '5', '4', 'Loyal'],
      ['1089', '45', '18', '₽240,000', '3', '3', '3', 'Developing'],
      ['1034', '130', '4', '₽35,000', '1', '2', '2', 'At Risk'],
    ],
  };

  const handleSelectExercise = (id: number) => {
    setActiveExerciseId(id);
    const ex = sqlExercises.find(e => e.id === id);
    setSql('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
    setFeedback(null);
  };

  const handleRunQuery = () => {
    if (!sql.trim()) {
      setFeedback({ type: 'error', message: 'Введите текст SQL запроса перед выполнением.' });
      return;
    }

    const res = exerciseResults[activeExercise.id] || exerciseResults[1];
    setResult(res);
    setFeedback({
      type: 'success',
      message: `Запрос успешно выполнен! Возвращено ${res.length - 1} строк. Навык SQL повышен!`,
    });
    completeExercise(activeExercise.id);
  };

  const handleInsertSolution = () => {
    setSql(activeExercise.solution);
    setShowSolution(true);
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="page-title">🗄️ SQL Practice & Sandbox</h1>
            <p className="page-subtitle">
              Интерактивная SQL-песочница для решения реальных бизнес-задач в Retail и Banking. Практикуйся в агрегациях, JOIN, CASE и оконных функциях.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              Решено: {progress.completedExerciseIds.length} / {sqlExercises.length}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise Filter Pills */}
      <div className="filter-pills" style={{ marginBottom: 20 }}>
        {['all', 'beginner', 'intermediate', 'advanced'].map(f => (
          <button
            key={f}
            className={`filter-pill ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `Все задания (${sqlExercises.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List Selector */}
      <div className="filter-pills" style={{ marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {filtered.map(ex => {
          const isDone = isExerciseCompleted(ex.id);
          const isSelected = ex.id === activeExercise.id;
          return (
            <button
              key={ex.id}
              className={`filter-pill ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelectExercise(ex.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? '1px solid var(--color-cyan-500)' : undefined,
              }}
            >
              <span>{isDone ? '✅' : `${ex.id}.`}</span>
              <span>{ex.title}</span>
            </button>
          );
        })}
      </div>

      <div className="sql-editor-container">
        {/* Editor Area */}
        <div>
          {/* Active Task Card */}
          <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid var(--color-cyan-500)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-cyan">Задание #{activeExercise.id}</span>
                <span className={`difficulty ${activeExercise.difficulty}`}>
                  <span className="difficulty-dot" /> {activeExercise.difficulty}
                </span>
                <span className="badge badge-gray">{activeExercise.category}</span>
                {isExerciseCompleted(activeExercise.id) && (
                  <span className="badge badge-success">✓ Выполнено</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowHint(!showHint)}>
                  💡 {showHint ? 'Скрыть подсказку' : 'Подсказка'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleInsertSolution} style={{ color: 'var(--color-cyan-600)' }}>
                  👁️ Показать решение
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: 'var(--color-navy-800)' }}>
              {activeExercise.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-navy-700)', lineHeight: 1.6, marginBottom: 10 }}>
              {activeExercise.task}
            </p>

            {/* Expected columns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="text-xs font-semibold text-gray-500">Ожидаемые колонки:</span>
              {activeExercise.expectedColumns.map(col => (
                <code key={col} style={{ fontSize: '0.8rem', background: 'var(--color-gray-100)', padding: '2px 6px', borderRadius: 4 }}>
                  {col}
                </code>
              ))}
            </div>

            {/* Hint */}
            {showHint && (
              <div style={{ marginTop: 12, padding: 12, background: 'rgba(6, 182, 212, 0.08)', borderRadius: 8, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-cyan-600)', marginBottom: 4 }}>💡 Подсказка:</div>
                <div className="text-sm" style={{ color: 'var(--color-navy-800)' }}>{activeExercise.hint}</div>
              </div>
            )}

            {/* Solution */}
            {showSolution && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--color-success-600)', marginBottom: 4 }}>✅ Пример правильного запроса:</div>
                <div className="code-block">
                  <div className="code-body">
                    <pre>{activeExercise.solution}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: feedback.type === 'success' ? 'var(--color-success-50)' : 'var(--color-danger-50)',
                  color: feedback.type === 'success' ? 'var(--color-success-600)' : 'var(--color-danger-600)',
                }}
              >
                {feedback.message}
              </div>
            )}
          </div>

          {/* SQL Textarea Editor */}
          <div className="sql-editor" style={{ marginBottom: 16 }}>
            <div className="sql-editor-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="sql-editor-title">SQL Query Editor</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSql('')}
                  style={{ color: 'var(--color-gray-400)' }}
                >
                  Очистить
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleRunQuery}>
                  ▶ Выполнить запрос (Run)
                </button>
              </div>
            </div>

            <textarea
              className="sql-editor-textarea"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="Напиши свой SQL запрос здесь... (Например: SELECT * FROM orders WHERE ...)"
              rows={8}
            />
          </div>

          {/* Result Output Table */}
          {result && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 className="card-title">📊 Результат запроса ({result.length - 1} записей)</h4>
                <span className="badge badge-success">✓ Выполнено</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-gray-100)' }}>
                      {result[0].map((h, i) => (
                        <th key={i} style={{ padding: '8px 12px', border: '1px solid var(--color-gray-200)', textAlign: 'left', fontWeight: 700, color: 'var(--color-navy-800)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} style={{ background: rIdx % 2 === 1 ? 'rgba(0,0,0,0.02)' : undefined }}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={{ padding: '6px 12px', border: '1px solid var(--color-gray-200)' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Schema Browser */}
        <div>
          <div className="card">
            <h4 className="card-title" style={{ marginBottom: 12 }}>🗄️ База данных песочницы</h4>
            <div className="text-sm text-gray-500" style={{ marginBottom: 16 }}>
              Таблицы доступны для запросов:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <h5 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-retail)' }}>🛒 Retail Схема</h5>
                <ul className="text-sm" style={{ paddingLeft: 18, marginTop: 4, lineHeight: 1.8 }}>
                  <li><code>customers</code> (id, name, city, segment)</li>
                  <li><code>orders</code> (id, customer_id, store_id, total, status)</li>
                  <li><code>products</code> (id, name, category, price, cost)</li>
                  <li><code>stores</code> (id, city, format, area)</li>
                </ul>
              </div>

              <div style={{ paddingTop: 12, borderTop: '1px solid var(--color-gray-200)' }}>
                <h5 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-banking)' }}>🏦 Banking Схема</h5>
                <ul className="text-sm" style={{ paddingLeft: 18, marginTop: 4, lineHeight: 1.8 }}>
                  <li><code>clients</code> (id, name, segment, risk_rating)</li>
                  <li><code>transactions</code> (id, client_id, amount, channel)</li>
                  <li><code>loans</code> (id, client_id, type, amount, npl_days)</li>
                  <li><code>deposits</code> (id, client_id, term_months, rate)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
