import React, { useState, useMemo } from 'react';
import { quizQuestions } from '../data/sharedData';
import { useProgress } from '../context/ProgressContext';

export default function QuizPage() {
  const { saveQuizScore } = useProgress();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [topicFilter, setTopicFilter] = useState('all');

  const topics = useMemo(() => [...new Set(quizQuestions.map(q => q.topic))], []);
  const questions = useMemo(
    () => topicFilter === 'all' ? quizQuestions : quizQuestions.filter(q => q.topic === topicFilter),
    [topicFilter]
  );

  const q = questions[currentQ];
  const totalAnswered = Object.keys(answers).length;
  const correctCount = submitted
    ? Object.entries(answers).filter(([qIdx, aIdx]) => {
        const question = questions[Number(qIdx)];
        return question && aIdx === question.correct;
      }).length
    : 0;

  const handleSelect = (optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optionIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const scorePct = Math.round((correctCount / questions.length) * 100);
    saveQuizScore(scorePct);
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers({});
    setSubmitted(false);
  };

  if (!q) return <p>Нет вопросов для выбранной темы.</p>;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">❓ Quizzes & Knowledge Check</h1>
        <p className="page-subtitle">
          Проверь свои знания по Business Analytics, SQL, метрикам, Excel и бизнес-кейсам.
        </p>
      </div>

      {/* Topic Filter */}
      <div className="filter-pills" style={{ marginBottom: 24 }}>
        <button className={`filter-pill ${topicFilter === 'all' ? 'active' : ''}`} onClick={() => { setTopicFilter('all'); handleReset(); }}>
          Все темы ({quizQuestions.length})
        </button>
        {topics.map(t => (
          <button key={t} className={`filter-pill ${topicFilter === t ? 'active' : ''}`} onClick={() => { setTopicFilter(t); handleReset(); }}>
            {t}
          </button>
        ))}
      </div>

      {!submitted ? (
        <>
          {/* Progress */}
          <div className="quiz-progress" style={{ marginBottom: 16 }}>
            {questions.map((_, i) => (
              <div
                key={i}
                className={`quiz-progress-dot ${i === currentQ ? 'active' : ''} ${i in answers ? 'answered' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentQ(i)}
              />
            ))}
            <span className="text-sm text-gray-500" style={{ marginLeft: 12 }}>
              {totalAnswered} / {questions.length}
            </span>
          </div>

          {/* Question */}
          <div className="quiz-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="badge badge-navy">Вопрос {currentQ + 1} / {questions.length}</span>
              <span className={`difficulty ${q.difficulty}`}>
                <span className="difficulty-dot" /> {q.difficulty}
              </span>
              <span className="badge badge-gray">{q.topic}</span>
            </div>

            <div className="quiz-question">{q.question}</div>

            {q.options.map((opt, i) => (
              <div
                key={i}
                className={`quiz-option ${answers[currentQ] === i ? 'selected' : ''}`}
                onClick={() => handleSelect(i)}
              >
                <div className="quiz-option-radio" />
                <span>{opt}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentQ === 0}
                  onClick={() => setCurrentQ(prev => prev - 1)}
                >
                  ← Назад
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentQ === questions.length - 1}
                  onClick={() => setCurrentQ(prev => prev + 1)}
                >
                  Далее →
                </button>
              </div>
              {totalAnswered === questions.length && (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Завершить тест ✓
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Results */
        <>
          <div className="card" style={{ textAlign: 'center', padding: 40, marginBottom: 24 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>
              {correctCount / questions.length >= 0.9 ? '🏆' : correctCount / questions.length >= 0.7 ? '👏' : correctCount / questions.length >= 0.5 ? '📚' : '💪'}
            </div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy-900)', marginBottom: 8 }}>
              Результат: {correctCount} / {questions.length}
            </h2>
            <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: correctCount / questions.length >= 0.7 ? 'var(--color-success-600)' : 'var(--color-warning-600)' }}>
              {Math.round((correctCount / questions.length) * 100)}%
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24 }}>
              <div><div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-success-600)' }}>{correctCount}</div><div className="text-sm text-gray-500">Правильных</div></div>
              <div><div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-danger-600)' }}>{questions.length - correctCount}</div><div className="text-sm text-gray-500">Неправильных</div></div>
            </div>
            <button className="btn btn-primary mt-6" onClick={handleReset}>Пройти ещё раз</button>
          </div>

          {/* Review */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>Разбор ответов</h3>
            {questions.map((question, qIdx) => {
              const userAns = answers[qIdx];
              const isCorrect = userAns === question.correct;
              return (
                <div key={qIdx} style={{ padding: '16px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span>{isCorrect ? '✅' : '❌'}</span>
                    <span className="font-semibold">{question.question}</span>
                  </div>
                  <div className="text-sm" style={{ paddingLeft: 28, color: 'var(--color-gray-600)' }}>
                    Правильный ответ: <strong style={{ color: 'var(--color-success-600)' }}>{question.options[question.correct]}</strong>
                    {!isCorrect && userAns !== undefined && (
                      <span style={{ marginLeft: 12, color: 'var(--color-danger-600)' }}>
                        (Твой ответ: {question.options[userAns]})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
