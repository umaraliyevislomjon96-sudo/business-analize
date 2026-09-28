import React, { useState, useCallback } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';

// Context
import { useTheme } from './context/ThemeContext';
import { useProgress } from './context/ProgressContext';

// Pages
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import RetailPage from './pages/RetailPage';
import BankingPage from './pages/BankingPage';
import SQLPage from './pages/SQLPage';
import ExcelPage from './pages/ExcelPage';
import MetricsPage from './pages/MetricsPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import QuizPage from './pages/QuizPage';
import ProjectsPage from './pages/ProjectsPage';
import ProgressPage from './pages/ProgressPage';
import GlossaryPage from './pages/GlossaryPage';
import ExercisesPage from './pages/ExercisesPage';
import LessonPage from './pages/LessonPage';
import SearchModal from './components/SearchModal';
import AITutor from './components/AITutor';

const sidebarSections = [
  {
    title: 'Обучение',
    links: [
      { to: '/', icon: '🏠', label: 'Главная' },
      { to: '/roadmap', icon: '🗺️', label: 'Learning Roadmap' },
      { to: '/progress', icon: '📊', label: 'Мой прогресс' },
    ],
  },
  {
    title: 'Специализации',
    links: [
      { to: '/retail', icon: '🛒', label: 'Retail Analytics', badge: '12' },
      { to: '/banking', icon: '🏦', label: 'Banking Analytics', badge: '12' },
    ],
  },
  {
    title: 'Инструменты & Лабы',
    links: [
      { to: '/excel', icon: '📗', label: 'Excel Lab', badge: '10' },
      { to: '/sql', icon: '🗄️', label: 'SQL Practice', badge: '10' },
      { to: '/exercises', icon: '✏️', label: 'Exercises' },
      { to: '/quizzes', icon: '❓', label: 'Quizzes', badge: '20' },
    ],
  },
  {
    title: 'Ресурсы',
    links: [
      { to: '/metrics', icon: '📐', label: 'Business Metrics' },
      { to: '/case-studies', icon: '📋', label: 'Case Studies', badge: '5' },
      { to: '/projects', icon: '🚀', label: 'Projects', badge: '12' },
      { to: '/glossary', icon: '📖', label: 'Glossary' },
    ],
  },
];

const breadcrumbMap: Record<string, string> = {
  '/': 'Главная',
  '/roadmap': 'Learning Roadmap',
  '/retail': 'Retail Analytics',
  '/banking': 'Banking Analytics',
  '/excel': 'Excel Lab',
  '/sql': 'SQL Practice',
  '/metrics': 'Business Metrics',
  '/case-studies': 'Case Studies',
  '/quizzes': 'Quizzes',
  '/projects': 'Projects',
  '/progress': 'Мой прогресс',
  '/glossary': 'Glossary',
  '/exercises': 'Exercises',
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { progress } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const currentPage = breadcrumbMap[location.pathname] || 'Страница';

  return (
    <div className="app-layout">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" onClick={() => { navigate('/'); closeSidebar(); }} style={{ cursor: 'pointer' }}>
          <div className="sidebar-logo-icon">BA</div>
          <div className="sidebar-logo-text">
            Business Analytics
            <span>Academy</span>
          </div>
        </div>

        {/* Current Level Pill in Sidebar */}
        <div style={{ padding: '12px 16px 4px 16px' }}>
          <div
            onClick={() => { navigate('/roadmap'); closeSidebar(); }}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1rem' }}>🎯</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan-400)', fontWeight: 700 }}>
                  Уровень: Level {progress.currentLevel}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-navy-200)' }}>
                  Прогресс: {progress.overallProgress}%
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-cyan-400)' }}>→</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarSections.map((section) => (
            <div className="sidebar-section" key={section.title}>
              <div className="sidebar-section-title">{section.title}</div>
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeSidebar}
                >
                  <span className="sidebar-link-icon">{link.icon}</span>
                  {link.label}
                  {link.badge && (
                    <span className="sidebar-badge">{link.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Открыть меню"
            >
              ☰
            </button>
            <div className="header-breadcrumb">
              <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Главная</a>
              {location.pathname !== '/' && (
                <>
                  <span className="separator">/</span>
                  <span className="current">{currentPage}</span>
                </>
              )}
            </div>
          </div>

          <div className="header-right">
            {/* Search */}
            <div className="header-search">
              <span className="header-search-icon">🔍</span>
              <input
                placeholder="Поиск уроков, KPI, формул..."
                onFocus={() => setSearchOpen(true)}
                readOnly
              />
            </div>

            {/* Quick Level Pill */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/roadmap')}
              title="Перейти к выбору уровня на Roadmap"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(6, 182, 212, 0.1)',
                color: 'var(--color-cyan-500)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              <span>🎯 Level {progress.currentLevel}</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              className="header-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
              aria-label="Сменить тему"
              style={{
                fontSize: '1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              className="header-btn"
              title="Мой прогресс"
              aria-label="Мой прогресс"
              onClick={() => navigate('/progress')}
            >
              📊
            </button>

            <div
              className="header-avatar"
              onClick={() => navigate('/progress')}
              style={{ cursor: 'pointer' }}
              title="Профиль студента"
            >
              BA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/retail" element={<RetailPage />} />
            <Route path="/banking" element={<BankingPage />} />
            <Route path="/excel" element={<ExcelPage />} />
            <Route path="/sql" element={<SQLPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
          </Routes>
        </div>
      </main>

      {/* Search Modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      {/* AI Tutor */}
      <AITutor />
    </div>
  );
}

export default App;
