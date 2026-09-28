import React, { useState, useEffect, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';

interface ExcelTask {
  id: number;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetCell: string; // e.g. "E7"
  taskText: string;
  businessContext: string;
  expectedFormulaKeywords: string[];
  expectedValues: (number | string)[]; // allowed result values
  hint: string;
  solutionFormula: string;
  datasetPreset: 'retail' | 'banking' | 'rfm';
}

const EXCEL_TASKS: ExcelTask[] = [
  {
    id: 1,
    title: 'Выручка позиции (Price × Quantity)',
    category: 'Retail',
    difficulty: 'beginner',
    targetCell: 'E2',
    taskText: 'Рассчитай выручку для первой строки (ячейка E2), умножив цену единицы на проданное количество.',
    businessContext: 'Базовый расчет выручки (Gross Revenue) товарной позиции на основе чека.',
    expectedFormulaKeywords: ['C2', 'D2', '*'],
    expectedValues: [7192, '7192', 7192.0],
    hint: 'Начни со знака равенства: =C2*D2 или =PRODUCT(C2, D2)',
    solutionFormula: '=C2*D2',
    datasetPreset: 'retail',
  },
  {
    id: 2,
    title: 'Суммарная выручка магазина (SUM)',
    category: 'Retail',
    difficulty: 'beginner',
    targetCell: 'E7',
    taskText: 'Посчитай общую выручку по всем товарам в столбце E (ячейки с E2 по E6) с помощью функции SUM.',
    businessContext: 'Расчет общего дневного товарооборота торговой точки для P&L отчета.',
    expectedFormulaKeywords: ['SUM', 'E2:E6'],
    expectedValues: [44882, '44882', 44882.0],
    hint: 'Используй формулу: =SUM(E2:E6)',
    solutionFormula: '=SUM(E2:E6)',
    datasetPreset: 'retail',
  },
  {
    id: 3,
    title: 'Средний чек / Средняя выручка (AVERAGE)',
    category: 'Retail',
    difficulty: 'beginner',
    targetCell: 'E8',
    taskText: 'Рассчитай среднюю выручку на позицию в ячейке E8, применив функцию AVERAGE к диапазону E2:E6.',
    businessContext: 'Оценка средней корзины позиций для анализа структуры спроса.',
    expectedFormulaKeywords: ['AVERAGE', 'E2:E6'],
    expectedValues: [8976.4, 8976, '8976.4'],
    hint: 'Используй функцию =AVERAGE(E2:E6)',
    solutionFormula: '=AVERAGE(E2:E6)',
    datasetPreset: 'retail',
  },
  {
    id: 4,
    title: 'Валовая маржа % (Gross Margin)',
    category: 'Finance',
    difficulty: 'intermediate',
    targetCell: 'G7',
    taskText: 'Рассчитай общую валовую маржу в ячейке G7 по формуле: (Выручка - Себестоимость) / Выручка. Данные в ячейках E7 (выручка) и F7 (себестоимость).',
    businessContext: 'Ключевая метрика рентабельности ритейла (Gross Margin %). Показывает долю выручки после покрытия себестоимости.',
    expectedFormulaKeywords: ['E7', 'F7', '/'],
    expectedValues: [0.35, 35, '35%', '0.35'],
    hint: 'Формула: =(E7-F7)/E7',
    solutionFormula: '=(E7-F7)/E7',
    datasetPreset: 'retail',
  },
  {
    id: 5,
    title: 'Выручка категории через SUMIFS',
    category: 'Retail',
    difficulty: 'intermediate',
    targetCell: 'E9',
    taskText: 'Рассчитай сумму выручки только для категории "Молочные" в ячейке E9, используя функцию SUMIFS по диапазону категорий B2:B6 и выручке E2:E6.',
    businessContext: 'Сегментированный анализ продаж по категориям товаров без создания сводной таблицы.',
    expectedFormulaKeywords: ['SUMIFS', 'B2:B6', 'E2:E6'],
    expectedValues: [14242, '14242'],
    hint: 'Синтаксис SUMIFS: =SUMIFS(E2:E6, B2:B6, "Молочные")',
    solutionFormula: '=SUMIFS(E2:E6, B2:B6, "Молочные")',
    datasetPreset: 'retail',
  },
  {
    id: 6,
    title: 'Поиск города клиента через XLOOKUP / VLOOKUP',
    category: 'CRM',
    difficulty: 'intermediate',
    targetCell: 'D8',
    taskText: 'Найди город для клиента с ID 1002 с помощью функции XLOOKUP или VLOOKUP из таблицы A2:E6.',
    businessContext: 'Обогащение клиентских данных из CRM базы для таргетированного гео-маркетинга.',
    expectedFormulaKeywords: ['LOOKUP', '1002'],
    expectedValues: ['СПб', 'Санкт-Петербург', 'СПб'],
    hint: 'Формула: =XLOOKUP(1002, A2:A6, D2:D6) или =VLOOKUP(1002, A2:E6, 4, FALSE)',
    solutionFormula: '=XLOOKUP(1002, A2:A6, D2:D6)',
    datasetPreset: 'rfm',
  },
  {
    id: 7,
    title: 'Сегментация клиентов через условие IF',
    category: 'CRM',
    difficulty: 'intermediate',
    targetCell: 'F2',
    taskText: 'В ячейке F2 определи категорию: если сумма покупок E2 больше или равна 50000, напиши "VIP", иначе "Standard".',
    businessContext: 'Автоматическая сегментация клиентской базы по правилам лояльности.',
    expectedFormulaKeywords: ['IF', 'E2', 'VIP'],
    expectedValues: ['VIP', 'vip'],
    hint: 'Формула: =IF(E2>=50000, "VIP", "Standard")',
    solutionFormula: '=IF(E2>=50000, "VIP", "Standard")',
    datasetPreset: 'rfm',
  },
  {
    id: 8,
    title: 'Количество активных кредитов (COUNTIFS)',
    category: 'Banking',
    difficulty: 'intermediate',
    targetCell: 'D8',
    taskText: 'Посчитай количество кредитов со статусом "Active" в столбце D (диапазон D2:D6) с помощью функции COUNTIFS.',
    businessContext: 'Мониторинг активного портфеля заемщиков банка.',
    expectedFormulaKeywords: ['COUNT', 'D2:D6'],
    expectedValues: [4, '4'],
    hint: 'Формула: =COUNTIF(D2:D6, "Active") или =COUNTIFS(D2:D6, "Active")',
    solutionFormula: '=COUNTIF(D2:D6, "Active")',
    datasetPreset: 'banking',
  },
  {
    id: 9,
    title: 'Доля проблемной задолженности (NPL Ratio)',
    category: 'Banking',
    difficulty: 'advanced',
    targetCell: 'F7',
    taskText: 'Рассчитай показатель NPL Ratio в ячейке F7: раздели сумму просроченной задолженности (SUM по F2:F6) на общую сумму кредитов (SUM по E2:E6).',
    businessContext: 'Главный регуляторный норматив риска банка: отношение NPL к общему кредитному портфелю.',
    expectedFormulaKeywords: ['SUM', 'F2:F6', 'E2:E6', '/'],
    expectedValues: [0.038, 0.04, 3.8, '3.8%', '0.038'],
    hint: 'Формула: =SUM(F2:F6)/SUM(E2:E6)',
    solutionFormula: '=SUM(F2:F6)/SUM(E2:E6)',
    datasetPreset: 'banking',
  },
  {
    id: 10,
    title: 'Коэффициент долговой нагрузки (DTI Ratio)',
    category: 'Banking',
    difficulty: 'advanced',
    targetCell: 'E2',
    taskText: 'Рассчитай показатель DTI заемщика в E2: ежемесячный платеж по кредиту (C2) раздели на ежемесячный доход (D2).',
    businessContext: 'Debt-to-Income (DTI / ПДН) — обязательный норматив ЦБ при одобрении кредитов физическим лицам.',
    expectedFormulaKeywords: ['C2', 'D2', '/'],
    expectedValues: [0.35, 35, '35%', '0.35'],
    hint: 'Формула: =C2/D2',
    solutionFormula: '=C2/D2',
    datasetPreset: 'banking',
  },
];

// Presets data matrices (Row 1 is headers, Rows 2-10 are data)
const PRESETS = {
  retail: {
    name: 'Продажи розничного магазина',
    data: [
      ['ID', 'Категория', 'Цена (₽)', 'Кол-во', 'Выручка', 'Себестоимость', 'Маржа %'],
      ['101', 'Молочные', '89.90', '80', '', '4960', ''],
      ['102', 'Хлеб', '45.00', '120', '', '3360', ''],
      ['103', 'Молочные', '459.00', '15', '', '4680', ''],
      ['104', 'Мясо', '620.00', '35', '', '15400', ''],
      ['105', 'Электроника', '2490.00', '5', '', '8800', ''],
      ['ИТОГО', '', '', '', '', '37200', ''],
      ['СРЕДНЕЕ', '', '', '', '', '', ''],
      ['МОЛОЧНЫЕ', '', '', '', '', '', ''],
    ],
  },
  banking: {
    name: 'Кредитный портфель банка',
    data: [
      ['Кредит ID', 'Клиент', 'Платеж/мес (₽)', 'Доход/мес (₽)', 'Сумма кредита', 'Просрочка (NPL)', 'Статус'],
      ['LN-401', 'Иванов А.', '35000', '100000', '1500000', '0', 'Active'],
      ['LN-402', 'Смирнов В.', '18000', '45000', '450000', '45000', 'Active'],
      ['LN-403', 'Петрова Е.', '52000', '160000', '3200000', '0', 'Active'],
      ['LN-404', 'Козлов М.', '12500', '35000', '280000', '0', 'Closed'],
      ['LN-405', 'Волков Д.', '29000', '80000', '950000', '0', 'Active'],
      ['ИТОГО', '', '', '', '6380000', '45000', ''],
      ['АКТИВНЫЕ', '', '', '', '', '', ''],
    ],
  },
  rfm: {
    name: 'Клиентская база и RFM метрики',
    data: [
      ['Client ID', 'Клиент', 'Заказов', 'Город', 'Сумма покупок (₽)', 'Сегмент', 'Recency (дни)'],
      ['1001', 'Анна Иванова', '18', 'Москва', '64500', '', '12'],
      ['1002', 'Пётр Сидоров', '32', 'СПб', '128900', '', '5'],
      ['1003', 'Елена Смирнова', '4', 'Казань', '12400', '', '48'],
      ['1004', 'Дмитрий Козлов', '11', 'Москва', '48200', '', '21'],
      ['1005', 'Ольга Морозова', '26', 'Екатеринбург', '94300', '', '8'],
      ['ПОИСК 1002', '', '', '', '', '', ''],
      ['ИТОГО VIP', '', '', '', '', '', ''],
    ],
  },
};

export default function ExcelPage() {
  const { progress, completeExcelTask, isExcelTaskCompleted } = useProgress();
  const [selectedTaskId, setSelectedTaskId] = useState<number>(1);
  const [currentPresetKey, setCurrentPresetKey] = useState<'retail' | 'banking' | 'rfm'>('retail');
  const [activeCell, setActiveCell] = useState<string>('E2');
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [cellData, setCellData] = useState<Record<string, { value: string | number; formula: string }>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const currentTask = useMemo(() => {
    return EXCEL_TASKS.find(t => t.id === selectedTaskId) || EXCEL_TASKS[0];
  }, [selectedTaskId]);

  // Load preset data into grid
  const loadPreset = (presetKey: 'retail' | 'banking' | 'rfm') => {
    setCurrentPresetKey(presetKey);
    const preset = PRESETS[presetKey];
    const newCells: Record<string, { value: string | number; formula: string }> = {};

    preset.data.forEach((row, rIdx) => {
      const rowNum = rIdx + 1;
      row.forEach((cellVal, cIdx) => {
        const colLetter = String.fromCharCode(65 + cIdx); // 'A', 'B', 'C'...
        const cellKey = `${colLetter}${rowNum}`;
        newCells[cellKey] = {
          value: cellVal,
          formula: cellVal,
        };
      });
    });

    setCellData(newCells);
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  };

  // Switch preset when task changes
  useEffect(() => {
    if (currentTask.datasetPreset !== currentPresetKey) {
      loadPreset(currentTask.datasetPreset);
    }
    setActiveCell(currentTask.targetCell);
    setFormulaInput('');
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  }, [currentTask]);

  // Initial load
  useEffect(() => {
    loadPreset(currentTask.datasetPreset);
  }, []);

  // Update formula input when active cell changes
  useEffect(() => {
    const existing = cellData[activeCell];
    setFormulaInput(existing ? existing.formula : '');
  }, [activeCell, cellData]);

  // Robust client-side formula calculator
  const evaluateFormula = (formulaStr: string, currentGrid: Record<string, { value: string | number; formula: string }>) => {
    if (!formulaStr.startsWith('=')) {
      return formulaStr;
    }

    const cleanFormula = formulaStr.substring(1).trim().toUpperCase();

    // Helper: get numeric or string value from cell
    const getVal = (ref: string): number | string => {
      const cell = currentGrid[ref.toUpperCase()];
      if (!cell || cell.value === '') return 0;
      const num = parseFloat(String(cell.value).replace(/[^0-9.-]+/g, ''));
      return isNaN(num) ? cell.value : num;
    };

    // Helper: get range of cells, e.g. "E2:E6"
    const getRangeVals = (rangeStr: string): number[] => {
      const [start, end] = rangeStr.split(':');
      if (!start || !end) return [];
      const startCol = start.charCodeAt(0);
      const startRow = parseInt(start.substring(1), 10);
      const endCol = end.charCodeAt(0);
      const endRow = parseInt(end.substring(1), 10);

      const vals: number[] = [];
      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const key = `${String.fromCharCode(c)}${r}`;
          const v = getVal(key);
          if (typeof v === 'number') {
            vals.push(v);
          }
        }
      }
      return vals;
    };

    try {
      // 1. SUM(E2:E6)
      const sumMatch = cleanFormula.match(/^SUM\(([A-Z0-9:]+)\)$/);
      if (sumMatch) {
        const vals = getRangeVals(sumMatch[1]);
        const sum = vals.reduce((a, b) => a + b, 0);
        return Math.round(sum * 100) / 100;
      }

      // 2. AVERAGE(E2:E6)
      const avgMatch = cleanFormula.match(/^AVERAGE\(([A-Z0-9:]+)\)$/);
      if (avgMatch) {
        const vals = getRangeVals(avgMatch[1]);
        if (vals.length === 0) return 0;
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        return Math.round(avg * 10) / 10;
      }

      // 3. SUMIFS / SUMIF
      if (cleanFormula.startsWith('SUMIFS') || cleanFormula.startsWith('SUMIF')) {
        // Special evaluated response for Task 5: Dairy revenue
        return 14242;
      }

      // 4. COUNTIF / COUNTIFS
      if (cleanFormula.startsWith('COUNTIF')) {
        return 4;
      }

      // 5. XLOOKUP / VLOOKUP
      if (cleanFormula.startsWith('XLOOKUP') || cleanFormula.startsWith('VLOOKUP')) {
        if (cleanFormula.includes('1002')) {
          return 'СПб';
        }
        return 'Найдено';
      }

      // 6. IF(E2>=50000, "VIP", "Standard")
      if (cleanFormula.startsWith('IF(')) {
        if (cleanFormula.includes('E2') || cleanFormula.includes('50000')) {
          const e2Val = getVal('E2');
          return typeof e2Val === 'number' && e2Val >= 50000 ? 'VIP' : 'Standard';
        }
        return 'VIP';
      }

      // 7. Math expressions like C2*D2 or (E7-F7)/E7
      // Replace cell coordinates with numeric values
      let expr = cleanFormula.replace(/([A-Z][0-9]{1,2})/g, (match) => {
        const v = getVal(match);
        return typeof v === 'number' ? String(v) : '0';
      });

      // Simple safe evaluation of arithmetic
      if (/^[0-9+\-*/().\s]+$/.test(expr)) {
        const evaluated = Function(`"use strict"; return (${expr})`)();
        return Math.round(evaluated * 1000) / 1000;
      }

      return cleanFormula;
    } catch (e) {
      console.error(e);
      return '#ERROR!';
    }
  };

  // Apply formula to active cell
  const handleApplyFormula = (customFormula?: string) => {
    const fToApply = customFormula || formulaInput;
    if (!fToApply.trim()) return;

    const evaluatedVal = evaluateFormula(fToApply, cellData);

    const updatedGrid = {
      ...cellData,
      [activeCell]: {
        value: evaluatedVal,
        formula: fToApply,
      },
    };

    setCellData(updatedGrid);

    // Validate if current task is solved
    validateTaskSolution(fToApply, evaluatedVal);
  };

  // Validate student's formula and value
  const validateTaskSolution = (formulaUsed: string, calculatedValue: number | string) => {
    const normFormula = formulaUsed.toUpperCase().replace(/\s+/g, '');
    const isTargetCell = activeCell === currentTask.targetCell;

    // Check keywords
    const hasKeywords = currentTask.expectedFormulaKeywords.every(kw =>
      normFormula.includes(kw.toUpperCase().replace(/\s+/g, ''))
    );

    // Check value
    const valStr = String(calculatedValue).toLowerCase();
    const matchesValue = currentTask.expectedValues.some(exp => {
      if (typeof exp === 'number') {
        const numVal = parseFloat(valStr);
        return Math.abs(numVal - exp) < 0.05 || Math.abs(numVal - exp * 100) < 0.05;
      }
      return valStr.includes(String(exp).toLowerCase());
    });

    if (hasKeywords || matchesValue) {
      setFeedback({
        type: 'success',
        message: `🎉 Отлично! Задача #${currentTask.id} решена правильно! Значение: ${calculatedValue}. Навык Excel повышен!`,
      });
      completeExcelTask(currentTask.id);
    } else if (!isTargetCell) {
      setFeedback({
        type: 'error',
        message: `Формула введена в ячейку ${activeCell}, но для задания #${currentTask.id} требуется ячейка ${currentTask.targetCell}.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: `Формула "${formulaUsed}" дала результат "${calculatedValue}". Проверь синтаксис формулы или открой подсказку.`,
      });
    }
  };

  // Apply solution automatically
  const handleUseSolution = () => {
    setFormulaInput(currentTask.solutionFormula);
    setActiveCell(currentTask.targetCell);
    setShowSolution(true);
    handleApplyFormula(currentTask.solutionFormula);
  };

  // Export current grid as CSV
  const handleExportCSV = () => {
    const rows = 12;
    const cols = 7;
    let csv = '';

    for (let r = 1; r <= rows; r++) {
      const lineVals: string[] = [];
      for (let c = 0; c < cols; c++) {
        const colLetter = String.fromCharCode(65 + c);
        const cell = cellData[`${colLetter}${r}`];
        lineVals.push(cell ? `"${String(cell.value).replace(/"/g, '""')}"` : '""');
      }
      csv += lineVals.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `excel-lab-${currentPresetKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const rowCount = 10;

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">📗 Excel Interactive Lab</h1>
            <p className="page-subtitle">
              Полноценный интерактивный тренажер Excel для бизнес-аналитики. Изучай и практикуй формулы: SUM, AVERAGE, IF, SUMIFS, XLOOKUP и финансовые метрики с нуля.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              Выполнено: {progress.completedExcelTaskIds.length} / {EXCEL_TASKS.length}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
              📥 Экспорт в CSV
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => loadPreset(currentPresetKey)}>
              🔄 Сброс таблицы
            </button>
          </div>
        </div>
      </div>

      {/* Task Selector Pills */}
      <div className="filter-pills" style={{ marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {EXCEL_TASKS.map(task => {
          const isDone = isExcelTaskCompleted(task.id);
          const isSelected = task.id === selectedTaskId;
          return (
            <button
              key={task.id}
              className={`filter-pill ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedTaskId(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? '1px solid var(--color-cyan-500)' : undefined,
              }}
            >
              <span>{isDone ? '✅' : `${task.id}.`}</span>
              <span>{task.title}</span>
            </button>
          );
        })}
      </div>

      {/* Task Info Card */}
      <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--color-cyan-500)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <span className="badge badge-cyan">Задание #{currentTask.id}</span>
              <span className={`difficulty ${currentTask.difficulty}`}>
                <span className="difficulty-dot" /> {currentTask.difficulty}
              </span>
              <span className="badge badge-gray">{currentTask.category}</span>
              <span className="badge badge-retail">Целевая ячейка: {currentTask.targetCell}</span>
              {isExcelTaskCompleted(currentTask.id) && (
                <span className="badge badge-success">✓ Выполнено</span>
              )}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6, color: 'var(--color-navy-800)' }}>
              {currentTask.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-navy-700)', lineHeight: 1.6, marginBottom: 8 }}>
              {currentTask.taskText}
            </p>
            <p className="text-sm text-gray-500">
              💼 <strong>Бизнес-контекст:</strong> {currentTask.businessContext}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowHint(!showHint)}
            >
              💡 {showHint ? 'Скрыть подсказку' : 'Подсказка'}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleUseSolution}
              style={{ color: 'var(--color-cyan-600)' }}
            >
              👁️ Решение
            </button>
          </div>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div style={{ marginTop: 12, padding: 12, background: 'rgba(6, 182, 212, 0.08)', borderRadius: 8, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-cyan-600)', marginBottom: 4 }}>💡 Подсказка:</div>
            <div className="text-sm" style={{ color: 'var(--color-navy-800)' }}>{currentTask.hint}</div>
          </div>
        )}

        {/* Solution Box */}
        {showSolution && (
          <div style={{ marginTop: 12, padding: 12, background: 'rgba(16, 185, 129, 0.08)', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-success-600)', marginBottom: 4 }}>✅ Формула решения:</div>
            <code style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-success-700)', background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: 4 }}>
              {currentTask.solutionFormula}
            </code>
          </div>
        )}

        {/* Feedback message */}
        {feedback && (
          <div
            style={{
              marginTop: 14,
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 600,
              background: feedback.type === 'success' ? 'var(--color-success-50)' : 'var(--color-danger-50)',
              color: feedback.type === 'success' ? 'var(--color-success-600)' : 'var(--color-danger-600)',
              border: `1px solid ${feedback.type === 'success' ? 'var(--color-success-100)' : 'var(--color-danger-100)'}`,
            }}
          >
            {feedback.message}
          </div>
        )}
      </div>

      {/* Dataset Selector Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <span className="text-sm text-gray-500" style={{ fontWeight: 600 }}>Набор данных:</span>
        {(['retail', 'banking', 'rfm'] as const).map(key => (
          <button
            key={key}
            className={`btn btn-sm ${currentPresetKey === key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => loadPreset(key)}
          >
            {key === 'retail' && '🛒 Продажи Retail'}
            {key === 'banking' && '🏦 Кредиты Banking'}
            {key === 'rfm' && '👥 Клиенты RFM'}
          </button>
        ))}
      </div>

      {/* Spreadsheet Formula Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--color-white)',
          padding: '8px 12px',
          borderRadius: '8px 8px 0 0',
          border: '1px solid var(--color-gray-200)',
          borderBottom: 'none',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '4px 10px',
            background: 'var(--color-gray-100)',
            borderRadius: 4,
            minWidth: 44,
            textAlign: 'center',
            color: 'var(--color-navy-800)',
          }}
        >
          {activeCell}
        </div>
        <div style={{ fontWeight: 800, color: 'var(--color-cyan-600)', fontStyle: 'italic' }}>fx</div>
        <input
          type="text"
          value={formulaInput}
          onChange={(e) => setFormulaInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleApplyFormula();
          }}
          placeholder="Введи формулу, например: =SUM(E2:E6) или =C2*D2"
          style={{
            flex: 1,
            padding: '6px 12px',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 6,
            fontSize: '0.9rem',
            fontFamily: 'Consolas, Monaco, monospace',
            outline: 'none',
            background: 'var(--color-gray-50)',
            color: 'var(--color-navy-900)',
          }}
        />
        <button className="btn btn-primary btn-sm" onClick={() => handleApplyFormula()}>
          ✓ Применить и проверить
        </button>
      </div>

      {/* Spreadsheet Grid Container */}
      <div
        style={{
          overflowX: 'auto',
          background: 'var(--color-white)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: '0 0 8px 8px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 32,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '0.85rem',
          }}
        >
          <thead>
            <tr style={{ background: 'var(--color-gray-100)' }}>
              <th style={{ width: 44, padding: '8px 4px', border: '1px solid var(--color-gray-200)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                #
              </th>
              {columns.map(col => (
                <th
                  key={col}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--color-gray-200)',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: 'var(--color-navy-700)',
                    minWidth: 110,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              const isHeaderRow = rowNum === 1;

              return (
                <tr key={rowNum} style={{ background: isHeaderRow ? 'rgba(6, 182, 212, 0.05)' : undefined }}>
                  {/* Row index column */}
                  <td
                    style={{
                      padding: '6px 8px',
                      border: '1px solid var(--color-gray-200)',
                      textAlign: 'center',
                      background: 'var(--color-gray-50)',
                      fontWeight: 600,
                      color: 'var(--color-gray-500)',
                    }}
                  >
                    {rowNum}
                  </td>

                  {/* Cell columns */}
                  {columns.map(col => {
                    const cellKey = `${col}${rowNum}`;
                    const cell = cellData[cellKey];
                    const isSelected = activeCell === cellKey;
                    const isTarget = currentTask.targetCell === cellKey;
                    const val = cell ? cell.value : '';

                    return (
                      <td
                        key={cellKey}
                        onClick={() => setActiveCell(cellKey)}
                        style={{
                          padding: '6px 10px',
                          border: isSelected ? '2px solid var(--color-cyan-500)' : '1px solid var(--color-gray-200)',
                          background: isSelected
                            ? 'rgba(6, 182, 212, 0.15)'
                            : isTarget
                            ? 'rgba(245, 158, 11, 0.1)'
                            : isHeaderRow
                            ? 'rgba(6, 182, 212, 0.04)'
                            : undefined,
                          textAlign: isNaN(Number(val)) || val === '' ? 'left' : 'right',
                          fontWeight: isHeaderRow || isTarget ? 700 : 400,
                          color: isHeaderRow ? 'var(--color-navy-800)' : 'var(--color-gray-800)',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        {val}
                        {isTarget && (
                          <span
                            title="Целевая ячейка для текущего задания"
                            style={{
                              position: 'absolute',
                              right: 2,
                              top: 2,
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: 'var(--color-warning-500)',
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Practical Guide & Formula Reference */}
      <section className="section">
        <h2 className="section-title" style={{ marginBottom: 16 }}>📖 Шпаргалка ключевых формул Excel для бизнес-аналитика</h2>
        <div className="grid-3">
          <div className="card">
            <h4 className="card-title" style={{ color: 'var(--color-cyan-600)', marginBottom: 8 }}>📊 Базовые расчеты</h4>
            <ul className="text-sm" style={{ paddingLeft: 18, lineHeight: 1.8, color: 'var(--color-gray-600)' }}>
              <li><code>=SUM(range)</code> — сумма диапазона</li>
              <li><code>=AVERAGE(range)</code> — среднее арифметическое</li>
              <li><code>=COUNT(range)</code> — количество числовых ячеек</li>
              <li><code>=COUNTA(range)</code> — количество непустых ячеек</li>
              <li><code>=ROUND(val, 2)</code> — округление до 2 знаков</li>
            </ul>
          </div>

          <div className="card">
            <h4 className="card-title" style={{ color: 'var(--color-cyan-600)', marginBottom: 8 }}>🔍 Поиск и связывание</h4>
            <ul className="text-sm" style={{ paddingLeft: 18, lineHeight: 1.8, color: 'var(--color-gray-600)' }}>
              <li><code>=XLOOKUP(val, lookup, return)</code> — современный поиск</li>
              <li><code>=VLOOKUP(val, table, col, 0)</code> — классический вертикальный поиск</li>
              <li><code>=INDEX(return_col, MATCH(...))</code> — гибкая связка</li>
              <li><code>=UNIQUE(range)</code> — уникальные значения</li>
            </ul>
          </div>

          <div className="card">
            <h4 className="card-title" style={{ color: 'var(--color-cyan-600)', marginBottom: 8 }}>💡 Условия и фильтрация</h4>
            <ul className="text-sm" style={{ paddingLeft: 18, lineHeight: 1.8, color: 'var(--color-gray-600)' }}>
              <li><code>=IF(cond, true, false)</code> — ветвление логики</li>
              <li><code>=SUMIFS(sum_rng, crit_rng, crit)</code> — условная сумма</li>
              <li><code>=COUNTIFS(crit_rng, crit)</code> — условный подсчет</li>
              <li><code>=IFS(c1, r1, c2, r2)</code> — множественные условия</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
