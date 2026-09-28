import { useState } from 'react';
import { metricsLibrary } from '../data/sharedData';

export default function MetricsPage() {
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const categories = [...new Set(metricsLibrary.map(m => m.category))];

  const filtered = metricsLibrary.filter(m => {
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.definition.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || m.industry === industryFilter;
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesIndustry && matchesCat;
  });

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">📐 Business Metrics / KPI Library</h1>
        <p className="page-subtitle">
          Библиотека ключевых бизнес-метрик для Retail и Banking аналитики.
          Каждая метрика содержит определение, формулу, примеры и типичные ошибки.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="header-search" style={{ position: 'relative' }}>
          <span className="header-search-icon">🔍</span>
          <input
            placeholder="Поиск метрик..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
        </div>

        <div className="filter-pills">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-gray-500)', marginRight: 4 }}>Industry:</span>
          {[{ v: 'all', l: 'Все' }, { v: 'retail', l: 'Retail' }, { v: 'banking', l: 'Banking' }, { v: 'both', l: 'Both' }].map(f => (
            <button key={f.v} className={`filter-pill ${industryFilter === f.v ? 'active' : ''}`} onClick={() => setIndustryFilter(f.v)}>{f.l}</button>
          ))}
        </div>

        <div className="filter-pills">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-gray-500)', marginRight: 4 }}>Category:</span>
          <button className={`filter-pill ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>Все</button>
          {categories.map(c => (
            <button key={c} className={`filter-pill ${categoryFilter === c ? 'active' : ''}`} onClick={() => setCategoryFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">Найдено: {filtered.length} метрик</p>

      {/* Metrics Grid */}
      <div className="grid-2">
        {filtered.map(metric => (
          <div
            key={metric.id}
            className="metric-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setExpandedMetric(expandedMetric === metric.id ? null : metric.id)}
          >
            <div className="metric-card-header">
              <h4>{metric.name}</h4>
              <div style={{ display: 'flex', gap: 4 }}>
                <span className={`badge ${metric.industry === 'retail' ? 'badge-retail' : metric.industry === 'banking' ? 'badge-banking' : 'badge-cyan'}`}>
                  {metric.industry === 'both' ? 'Retail & Banking' : metric.industry}
                </span>
                <span className="badge badge-gray">{metric.category}</span>
              </div>
            </div>
            <p className="metric-card-desc">{metric.definition}</p>

            <div className="formula">{metric.formula}</div>

            {expandedMetric === metric.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-gray-100)' }}>
                <div style={{ marginBottom: 12 }}>
                  <strong className="text-sm">📌 Пример:</strong>
                  <p className="text-sm text-gray-600" style={{ marginTop: 4 }}>{metric.example}</p>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong className="text-sm">📊 Где используется:</strong>
                  <p className="text-sm text-gray-600" style={{ marginTop: 4 }}>{metric.usedIn}</p>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong className="text-sm">🎯 Интерпретация:</strong>
                  <p className="text-sm text-gray-600" style={{ marginTop: 4 }}>{metric.interpretation}</p>
                </div>
                <div>
                  <strong className="text-sm">⚠️ Типичные ошибки:</strong>
                  <p className="text-sm text-gray-600" style={{ marginTop: 4 }}>{metric.commonMistakes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
