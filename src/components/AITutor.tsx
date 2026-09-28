import { useState, useRef, useEffect } from 'react';

const suggestedQuestions = [
  'Что такое Gross Margin?',
  'Как рассчитать CLV?',
  'Напиши SQL для TOP-10 клиентов',
  'Объясни разницу Revenue vs Profit',
  'Что такое NPL ratio в банке?',
  'Как провести RFM-анализ?',
];

const aiResponses: Record<string, string> = {
  'gross margin': `**Gross Margin (Валовая маржа)** — это доля валовой прибыли в выручке.

**Формула:** Gross Margin = (Revenue − COGS) / Revenue × 100%

**Пример:**
- Revenue: ₽1,000,000
- COGS (себестоимость): ₽650,000
- Gross Profit: ₽350,000
- Gross Margin: 35%

**Интерпретация:** GM 35% означает, что с каждого рубля выручки 35 копеек остаётся после вычета прямых затрат на товар.

**Benchmark:**
- Продуктовый ритейл: 20-30%
- Электроника: 30-40%
- SaaS: 70-85%`,

  'clv': `**CLV (Customer Lifetime Value)** — пожизненная ценность клиента.

**Простая формула:**
CLV = ARPU × Average Lifespan × Profit Margin

**Пример:**
- ARPU: ₽5,000/мес
- Средний срок жизни: 24 мес
- Маржа: 30%
- CLV = 5,000 × 24 × 0.30 = ₽36,000

**Ключевое правило:** CLV/CAC > 3 — здоровый бизнес.

**SQL для расчёта:**
\`\`\`sql
SELECT customer_id,
  SUM(amount) * 0.3 AS historical_clv
FROM orders
GROUP BY customer_id;
\`\`\``,

  'sql': `**SQL-запрос для TOP-10 клиентов по выручке:**

\`\`\`sql
SELECT 
  c.customer_id,
  c.first_name || ' ' || c.last_name AS name,
  COUNT(o.order_id) AS orders,
  SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC
LIMIT 10;
\`\`\`

**Ключевые моменты:**
- JOIN для связи таблиц
- GROUP BY для агрегации
- ORDER BY DESC для сортировки
- LIMIT 10 для ограничения`,

  'revenue': `**Revenue vs Profit — ключевое отличие:**

📊 **Revenue (Выручка)** = общий доход от продаж
💰 **Profit (Прибыль)** = Revenue − все расходы

**Виды Profit:**
1. **Gross Profit** = Revenue − COGS
2. **Operating Profit** = Gross Profit − OpEx
3. **Net Profit** = Operating Profit − Taxes − Interest

**Пример:**
- Revenue: ₽10M
- COGS: ₽6M → Gross Profit: ₽4M
- OpEx: ₽2M → Operating Profit: ₽2M
- Taxes: ₽0.4M → Net Profit: ₽1.6M

⚠️ Частая ошибка: путать Revenue и Profit. Компания может иметь огромную выручку, но быть убыточной.`,

  'npl': `**NPL (Non-Performing Loans)** — просроченные кредиты.

**Определение:** Кредиты с просрочкой платежей > 90 дней.

**Формула:** NPL Ratio = NPL Amount / Total Portfolio × 100%

**Пример:**
- Портфель: ₽50B
- NPL: ₽1.4B
- NPL Ratio: 2.8%

**Benchmarks:**
- < 3% — хорошее качество
- 3-5% — требует мониторинга
- > 5% — проблемный портфель

**Связанные метрики:**
- Coverage Ratio = Provisions / NPL
- Cost of Risk = Provisions / Average Portfolio`,

  'rfm': `**RFM-анализ** — метод сегментации клиентов.

**3 компонента:**
- **R (Recency)** — давность последней покупки
- **F (Frequency)** — частота покупок
- **M (Monetary)** — сумма покупок

**Сегменты:**
| Сегмент | R | F | M |
|---------|---|---|---|
| Champions | 5 | 5 | 5 |
| Loyal | 3-4 | 4-5 | 3-5 |
| At Risk | 1-2 | 3-5 | 3-5 |
| Lost | 1 | 1-2 | 1-2 |

**SQL для RFM:**
\`\`\`sql
SELECT customer_id,
  NTILE(5) OVER (ORDER BY recency ASC) AS R,
  NTILE(5) OVER (ORDER BY frequency DESC) AS F,
  NTILE(5) OVER (ORDER BY monetary DESC) AS M
FROM rfm_data;
\`\`\``,
};

function getAIResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('gross margin') || q.includes('маржа') || q.includes('margin')) return aiResponses['gross margin'];
  if (q.includes('clv') || q.includes('ltv') || q.includes('lifetime')) return aiResponses['clv'];
  if (q.includes('sql') || q.includes('top-10') || q.includes('запрос')) return aiResponses['sql'];
  if (q.includes('revenue') || q.includes('profit') || q.includes('выручка') || q.includes('прибыль')) return aiResponses['revenue'];
  if (q.includes('npl') || q.includes('просрочк')) return aiResponses['npl'];
  if (q.includes('rfm') || q.includes('сегментац')) return aiResponses['rfm'];
  return `Отличный вопрос! 🎯\n\nК сожалению, я AI-тьютор в demo-режиме и могу отвечать на вопросы о:\n\n- **Business Metrics:** Gross Margin, Revenue, Profit, CLV, ROI\n- **Banking:** NPL, Cost of Risk\n- **SQL:** Запросы, JOIN, Window Functions\n- **Аналитика:** RFM, Cohort Analysis, Segmentation\n\nПопробуйте задать вопрос из этих тем! Например:\n"Что такое Gross Margin?" или "Как рассчитать CLV?"`;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AITutor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Привет! 👋 Я AI-тьютор Business Analytics Academy.\n\nЗадавай вопросы по бизнес-аналитике, метрикам, SQL или любой теме из курса. Я помогу объяснить концепцию, показать формулу или написать SQL-запрос.\n\n**Попробуй спросить:**\n- Что такое Gross Margin?\n- Как рассчитать CLV?\n- Напиши SQL для TOP-10 клиентов' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* FAB */}
      <button
        className="ai-tutor-fab"
        onClick={() => setOpen(!open)}
        title="AI Tutor"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="ai-tutor-panel">
          <div className="ai-tutor-header">
            <div>
              <strong>🤖 AI Tutor</strong>
              <span className="text-xs" style={{ marginLeft: 8, color: 'var(--color-cyan-200)' }}>Online</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          <div className="ai-tutor-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-tutor-message ${msg.role}`}>
                <div className="ai-tutor-message-content" style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="ai-tutor-message assistant">
                <div className="ai-tutor-message-content">
                  <span className="typing-indicator">
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div style={{ padding: '8px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {suggestedQuestions.slice(0, 3).map(q => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  fontSize: 'var(--font-size-xs)', padding: '4px 10px',
                  background: 'var(--color-cyan-50)', border: '1px solid var(--color-cyan-200)',
                  borderRadius: 16, cursor: 'pointer', color: 'var(--color-cyan-700)',
                  whiteSpace: 'nowrap',
                }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="ai-tutor-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
              placeholder="Задай вопрос по аналитике..."
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || typing}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
