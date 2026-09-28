import { useState } from 'react';
import { projects } from '../data/sharedData';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? projects : projects.filter(p => p.type === filter);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">🚀 Projects</h1>
        <p className="page-subtitle">
          Реальные учебные проекты для формирования портфолио Business Analyst.
          Каждый проект содержит бизнес-задачу, dataset, задания и критерии оценки.
        </p>
      </div>

      <div className="filter-pills" style={{ marginBottom: 24 }}>
        <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Все проекты ({projects.length})</button>
        <button className={`filter-pill ${filter === 'retail' ? 'active' : ''}`} onClick={() => setFilter('retail')}>🛒 Retail ({projects.filter(p => p.type === 'retail').length})</button>
        <button className={`filter-pill ${filter === 'banking' ? 'active' : ''}`} onClick={() => setFilter('banking')}>🏦 Banking ({projects.filter(p => p.type === 'banking').length})</button>
      </div>

      <div className="grid-2">
        {filtered.map(project => (
          <div key={project.id} className="project-card">
            <div className={`project-card-banner ${project.type}`} />
            <div className="project-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className={`badge ${project.type === 'retail' ? 'badge-retail' : 'badge-banking'}`}>
                  {project.type === 'retail' ? '🛒 Retail' : '🏦 Banking'}
                </span>
                <span className={`difficulty ${project.difficulty}`}>
                  <span className="difficulty-dot" /> {project.difficulty}
                </span>
                <span className="text-sm text-gray-500">⏱ {project.duration}</span>
              </div>

              <h4>{project.title}</h4>
              <p>{project.businessProblem}</p>

              <div style={{ marginBottom: 16 }}>
                <h5 className="text-sm font-bold" style={{ marginBottom: 8, color: 'var(--color-navy-800)' }}>📋 Бизнес-вопросы:</h5>
                <ul style={{ paddingLeft: 18 }}>
                  {project.businessQuestions.map((q, i) => (
                    <li key={i} className="text-sm text-gray-600" style={{ marginBottom: 4 }}>{q}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h5 className="text-sm font-bold" style={{ marginBottom: 8, color: 'var(--color-navy-800)' }}>✅ Задачи:</h5>
                <ul style={{ paddingLeft: 18 }}>
                  {project.tasks.map((t, i) => (
                    <li key={i} className="text-sm text-gray-600" style={{ marginBottom: 4 }}>{t}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h5 className="text-sm font-bold" style={{ marginBottom: 8, color: 'var(--color-navy-800)' }}>📦 Deliverables:</h5>
                <ul style={{ paddingLeft: 18 }}>
                  {project.expectedDeliverables.map((d, i) => (
                    <li key={i} className="text-sm text-gray-600" style={{ marginBottom: 4 }}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="project-tools">
                {project.tools.map(tool => (
                  <span key={tool} className="badge badge-cyan">{tool}</span>
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary btn-sm w-full">Начать проект</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
