const math = {
  sqrt: Math.sqrt,
  pi: Math.PI,
  e: Math.E,
  sin: (x) => isDeg ? Math.sin(x * Math.PI / 180) : Math.sin(x),
  cos: (x) => isDeg ? Math.cos(x * Math.PI / 180) : Math.cos(x),
  tan: (x) => isDeg ? Math.tan(x * Math.PI / 180) : Math.tan(x),
  log: Math.log10,
  ln: Math.log,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  fact: (n) => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }
};

let expression = '';
let lastResult = null;
let historyList = [];
let currentMode = 'basic';
let isDeg = true;

function toggleDegRad() {
  isDeg = !isDeg;
  if (currentMode === 'sci') setMode('sci');
}

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  if (currentTheme === 'light') {
    body.removeAttribute('data-theme');
  } else {
    body.setAttribute('data-theme', 'light');
  }
}

const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result-line');
const historyLineEl = document.getElementById('history-line');
const displayEl = document.getElementById('display');
const copyBtn = document.getElementById('copy-btn');

function copyResult() {
  const resultText = resultEl.textContent.trim();
  if (resultText && resultText !== '#' && resultText !== 'SyntaxError: invalid syntax') {
    navigator.clipboard.writeText(resultText).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.style.color = 'var(--green)';
      copyBtn.style.borderColor = 'var(--green)';
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 1500);
    });
  }
}

function renderExpr() {
  if (!expression) {
    exprEl.innerHTML = '<span class="cursor"></span>';
    return;
  }
  // Syntax highlight
  let html = expression
    .replace(/(\d+\.?\d*)/g, '<span class="expr-num">$1</span>')
    .replace(/([+\-*/%^])/g, '<span class="expr-op">$1</span>')
    .replace(/([()])/g, '<span class="expr-paren">$1</span>');
  exprEl.innerHTML = html + '<span class="cursor"></span>';
}

function insert(val) {
  expression += val;
  renderExpr();
  previewResult();
}

function insertFn(val) {
  if (val === 'math.pi') {
    expression += '3.14159265358979';
  } else {
    expression += val;
  }
  renderExpr();
  previewResult();
}

function backspace() {
  expression = expression.slice(0, -1);
  renderExpr();
  previewResult();
}

function clearAll() {
  expression = '';
  lastResult = null;
  renderExpr();
  resultEl.textContent = '\u00a0';
  resultEl.className = 'result-line';
  historyLineEl.textContent = '';
  displayEl.classList.remove('error');
}

function clearHistory() {
  historyList = [];
  setMode('history');
}

function previewResult() {
  if (!expression) {
    resultEl.textContent = '\u00a0';
    resultEl.className = 'result-line';
    return;
  }
  try {
    const sanitized = sanitize(expression);
    const res = Function('"use strict"; const math = arguments[0]; return ' + sanitized)(math);
    if (typeof res === 'number' && isFinite(res)) {
      const formatted = formatNum(res);
      resultEl.textContent = formatted;
      resultEl.className = 'result-line show';
    } else {
      resultEl.textContent = '\u00a0';
      resultEl.className = 'result-line';
    }
  } catch {
    resultEl.textContent = '\u00a0';
    resultEl.className = 'result-line';
  }
}

function sanitize(expr) {
  // Replace display operators
  let e = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  // Allow math.*, digits, operators, parens, dot, space
  if (/[^0-9+\-*/%().^a-zA-Z_\s]/.test(e)) throw new Error('invalid');
  return e;
}

function formatNum(n) {
  if (Number.isInteger(n)) return n.toString();
  // Up to 10 sig digits
  let s = parseFloat(n.toPrecision(10)).toString();
  return s;
}

function calculate() {
  if (!expression) return;
  try {
    const sanitized = sanitize(expression);
    const res = Function('"use strict"; const math = arguments[0]; return ' + sanitized)(math);
    if (typeof res !== 'number' || !isFinite(res)) throw new Error('Invalid result');

    const formatted = formatNum(res);

    // History
    historyList.unshift({ expr: expression, result: formatted });
    if (historyList.length > 20) historyList.pop();

    historyLineEl.innerHTML = `<span class="history-op">=</span> ${formatted}`;

    lastResult = res;
    expression = formatted;
    renderExpr();
    resultEl.textContent = `${formatted}`;
    resultEl.className = 'result-line show';
    displayEl.classList.remove('error');

  } catch {
    displayEl.classList.add('error');
    resultEl.textContent = 'SyntaxError: invalid syntax';
    resultEl.className = 'result-line show';
    resultEl.style.color = 'var(--red)';
    setTimeout(() => {
      displayEl.classList.remove('error');
      resultEl.style.color = '';
    }, 600);
  }
}

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach((t, i) => {
    t.classList.toggle('active', ['basic','sci','history'][i] === mode);
  });

  const keypad = document.getElementById('keypad');

  if (mode === 'sci') {
    keypad.innerHTML = `
      <button class="btn fn" onclick="toggleDegRad()">${isDeg ? 'DEG' : 'RAD'}</button>
      <button class="btn fn" onclick="insertFn('math.fact(')">n!</button>
      <button class="btn fn" onclick="insertFn('math.abs(')">|x|</button>
      <button class="btn clear" onclick="clearAll()">AC</button>

      <button class="btn fn" onclick="insertFn('math.sin(')">sin</button>
      <button class="btn fn" onclick="insertFn('math.cos(')">cos</button>
      <button class="btn fn" onclick="insertFn('math.tan(')">tan</button>
      <button class="btn backspace" onclick="backspace()">⌫</button>

      <button class="btn fn" onclick="insertFn('math.log(')">log</button>
      <button class="btn fn" onclick="insertFn('math.ln(')">ln</button>
      <button class="btn fn" onclick="insertFn('math.sqrt(')">√</button>
      <button class="btn fn" onclick="insert('**')">xʸ</button>

      <button class="btn" onclick="insert('7')">7</button>
      <button class="btn" onclick="insert('8')">8</button>
      <button class="btn" onclick="insert('9')">9</button>
      <button class="btn op" onclick="insert('/')">÷</button>

      <button class="btn" onclick="insert('4')">4</button>
      <button class="btn" onclick="insert('5')">5</button>
      <button class="btn" onclick="insert('6')">6</button>
      <button class="btn op" onclick="insert('*')">×</button>

      <button class="btn" onclick="insert('1')">1</button>
      <button class="btn" onclick="insert('2')">2</button>
      <button class="btn" onclick="insert('3')">3</button>
      <button class="btn op" onclick="insert('-')">−</button>

      <button class="btn" onclick="insert('0')">0</button>
      <button class="btn" onclick="insert('.')">.</button>
      <button class="btn equals" onclick="calculate()">=</button>
      <button class="btn op" onclick="insert('+')">+</button>
    `;
  } else if (mode === 'history') {
    if (historyList.length === 0) {
      keypad.innerHTML = `<div style="grid-column:span 4;padding:24px;text-align:center;color:var(--muted);font-size:12px;">No history yet.<br>Perform calculations first.</div>`;
    } else {
      let rows = historyList.slice(0, 8).map(h => `
        <div onclick="loadHistory('${h.result}')" style="grid-column:span 4;display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:12px;transition:background 0.1s;" onmouseover="this.style.background='#2c3139'" onmouseout="this.style.background='var(--surface2)'">
          <span style="color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:60%">${h.expr}</span>
          <span style="color:var(--green)">= ${h.result}</span>
        </div>
      `).join('');
      keypad.innerHTML = rows + `
        <button class="btn clear wide" onclick="clearHistory()" style="grid-column: span 4; height: 40px; margin-top: 8px; font-size: 11px;">Clear History</button>
      `;
    }
  } else {
    // Basic
    keypad.innerHTML = `
      <button class="btn fn" onclick="insertFn('math.sqrt(')">√</button>
      <button class="btn fn" onclick="insertFn('math.pi')">π</button>
      <button class="btn fn" onclick="insert('**')">xʸ</button>
      <button class="btn clear" onclick="clearAll()">AC</button>

      <button class="btn fn" onclick="insert('(')">(</button>
      <button class="btn fn" onclick="insert(')')">)</button>
      <button class="btn fn" onclick="insert('%')">%</button>
      <button class="btn backspace" onclick="backspace()">⌫</button>

      <button class="btn" onclick="insert('7')">7</button>
      <button class="btn" onclick="insert('8')">8</button>
      <button class="btn" onclick="insert('9')">9</button>
      <button class="btn op" onclick="insert('/')">÷</button>

      <button class="btn" onclick="insert('4')">4</button>
      <button class="btn" onclick="insert('5')">5</button>
      <button class="btn" onclick="insert('6')">6</button>
      <button class="btn op" onclick="insert('*')">×</button>

      <button class="btn" onclick="insert('1')">1</button>
      <button class="btn" onclick="insert('2')">2</button>
      <button class="btn" onclick="insert('3')">3</button>
      <button class="btn op" onclick="insert('-')">−</button>

      <button class="btn" onclick="insert('0')">0</button>
      <button class="btn" onclick="insert('.')">.</button>
      <button class="btn equals" onclick="calculate()">=</button>
      <button class="btn op" onclick="insert('+')">+</button>
    `;
  }
}

function loadHistory(val) {
  expression = val;
  setMode('basic');
  renderExpr();
}

// Keyboard support
document.addEventListener('keydown', e => {
  if (currentMode === 'history') return;
  if (e.key >= '0' && e.key <= '9') insert(e.key);
  else if (['+','-','*','/','(',')','.','^','%'].includes(e.key)) insert(e.key);
  else if (e.key === 'Enter') calculate();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clearAll();
});
