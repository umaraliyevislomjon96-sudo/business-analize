import { useState, useMemo } from 'react';
import { glossaryTerms } from '../data/sharedData';

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => [...new Set(glossaryTerms.map(t => t.category))], []);

  const filtered = useMemo(() => {
    return glossaryTerms.filter(t => {
      const matchesSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [search, categoryFilter]);

  // Group by first letter
  const grouped = useMemo(() => {
    const groups: Record<string, typeof glossaryTerms> = {};
    filtered.sort((a, b) => a.term.localeCompare(b.term)).forEach(term => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filtered]);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">📖 Glossary</h1>
        <p className="page-subtitle">
          Словарь терминов бизнес-аналитики. {glossaryTerms.length} терминов с определениями.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="header-search" style={{ position: 'relative' }}>
          <span className="header-search-icon">🔍</span>
          <input
            placeholder="Поиск термина..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
        </div>
        <div className="filter-pills">
          <button className={`filter-pill ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>Все</button>
          {categories.map(c => (
            <button key={c} className={`filter-pill ${categoryFilter === c ? 'active' : ''}`} onClick={() => setCategoryFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">Найдено: {filtered.length} терминов</p>

      {/* Terms */}
      <div className="card">
        {Object.entries(grouped).map(([letter, terms]) => (
          <div key={letter}>
            <div className="glossary-letter">{letter}</div>
            <dl>
              {terms.map(term => (
                <div key={term.term} className="glossary-term">
                  <dt>
                    {term.term}
                    <span className="badge badge-gray" style={{ marginLeft: 8, fontSize: '0.65rem' }}>{term.category}</span>
                  </dt>
                  <dd>{term.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>Ничего не найдено</h3>
            <p>Попробуй изменить поисковый запрос или фильтр</p>
          </div>
        )}
      </div>
    </>
  );
}
