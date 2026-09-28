import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { retailModules } from '../data/retailData';
import { bankingModules } from '../data/bankingData';
import { glossaryTerms, metricsLibrary, sqlExercises } from '../data/sharedData';

interface Props { onClose: () => void }

export default function SearchModal({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items: { type: string; title: string; desc: string; to: string }[] = [];

    retailModules.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
      .forEach(m => items.push({ type: '🛒 Retail', title: m.title, desc: m.description.slice(0, 80) + '...', to: `/lesson/${m.id}` }));

    bankingModules.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
      .forEach(m => items.push({ type: '🏦 Banking', title: m.title, desc: m.description.slice(0, 80) + '...', to: `/lesson/${m.id}` }));

    glossaryTerms.filter(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach(t => items.push({ type: '📖 Glossary', title: t.term, desc: t.definition.slice(0, 80) + '...', to: '/glossary' }));

    metricsLibrary.filter(m => m.name.toLowerCase().includes(q) || m.definition.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach(m => items.push({ type: '📐 Metric', title: m.name, desc: m.definition.slice(0, 80) + '...', to: '/metrics' }));

    sqlExercises.filter(e => e.title.toLowerCase().includes(q) || e.task.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach(e => items.push({ type: '🗄️ SQL', title: `#${e.id}. ${e.title}`, desc: e.task.slice(0, 80) + '...', to: '/sql' }));

    return items.slice(0, 12);
  }, [query]);

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-input">
          <span>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск уроков, метрик, терминов, SQL задач..."
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <div className="search-modal-results">
          {!query.trim() ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-gray-400)' }}>
              <p>Начните вводить для поиска</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                {['Revenue', 'SQL JOIN', 'Churn', 'NPL', 'RFM', 'CLV'].map(s => (
                  <button key={s} onClick={() => setQuery(s)} style={{
                    background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)',
                    borderRadius: 20, padding: '4px 12px', fontSize: 'var(--font-size-xs)',
                    cursor: 'pointer', color: 'var(--color-navy-700)',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-gray-400)' }}>
              <p>Ничего не найдено по запросу "{query}"</p>
            </div>
          ) : (
            results.map((item, i) => (
              <div
                key={i}
                className="search-result-item"
                onClick={() => { navigate(item.to); onClose(); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>{item.type}</span>
                  <strong className="text-sm">{item.title}</strong>
                </div>
                <p className="text-xs text-gray-500" style={{ marginTop: 4 }}>{item.desc}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
