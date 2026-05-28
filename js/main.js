document.addEventListener('DOMContentLoaded', async function() {
  // System clock
  const clock = document.getElementById('sysClock');
  const uptime = document.getElementById('uptime');
  const startTime = Date.now() - 1000 * 60 * 60 * 27 * 3; // 27.5 days uptime

  function updateClock() {
    const now = new Date();
    if (clock) clock.textContent = now.toTimeString().slice(0, 8);
    if (uptime) {
      const hours = Math.floor((Date.now() - startTime) / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      uptime.textContent = `UPTIME: ${days}d ${hours % 24}h`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Load JSON from data files
  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  // Data arrays
  let signalsData = [];
  let failedData = [];
  let operatorData = [];
  let allEntries = [];

  // Load data from JSON files
  async function loadAllData() {
    const extSignals = await loadJSON('data/signals.json');
    const extFailed = await loadJSON('data/failed-tests.json');
    const extOperator = await loadJSON('data/operator-logs.json');

    if (extSignals && Array.isArray(extSignals)) {
      signalsData = extSignals.map(s => ({
        timestamp: s.timestamp ? Date.parse(s.timestamp) : Date.now(),
        title: s.title || `${s.model || 'Signal'} ${s.id || ''}`,
        content: s.content || '',
        model: s.model || '',
        type: 'signal'
      }));
    }

    if (extFailed && Array.isArray(extFailed)) {
      failedData = extFailed.map(f => ({
        timestamp: f.timestamp ? Date.parse(f.timestamp) : Date.now(),
        title: f.title || `FAILED TEST #${f.id || '?'}`,
        content: f.content || '',
        severity: f.severity || 'warning',
        type: 'failed'
      }));
    }

    if (extOperator && Array.isArray(extOperator)) {
      operatorData = extOperator.map(o => ({
        timestamp: o.timestamp ? Date.parse(o.timestamp) : Date.now(),
        content: (o.operator ? o.operator + ': ' : '') + o.content,
        operator: o.operator || '',
        type: 'operator'
      }));
    }

    // Combine and sort by timestamp descending
    allEntries = [
      ...signalsData.map(e => ({ ...e, type: 'signal' })),
      ...failedData.map(e => ({ ...e, type: 'failed' })),
      ...operatorData.map(e => ({ ...e, type: 'operator' }))
    ];
    allEntries.sort((a, b) => b.timestamp - a.timestamp);
  }

  await loadAllData();

  // Format time for display
  function fmtTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
  }

  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  }

  // Render timeline on archives page
  const archiveFeed = document.getElementById('archiveFeed');
  if (archiveFeed) {
    archiveFeed.innerHTML = allEntries.map(e => {
      const timeStr = fmtTime(e.timestamp);
      const typeClass = e.type === 'failed' ? 'failed' : (e.type === 'operator' ? '' : '');
      const badge = e.type === 'failed' ? '<span class="signal-badge failed">FAILED</span>' :
                    e.type === 'operator' ? '<span class="signal-badge" style="background:rgba(252,211,77,.15);color:#fcd34d">OPERATOR</span>' :
                    '<span class="signal-badge live">LIVE</span>';
      const title = e.type === 'operator' ? '' : `<span class="signal-title">${e.title}</span>`;
      return `
        <div class="signal-item ${typeClass}">
          <span class="signal-time">${timeStr}</span>
          ${title}
          ${e.type === 'operator' ? `<span class="signal-title" style="color:var(--operator)">${e.content}</span>` : ''}
          ${badge}
        </div>
      `;
    }).join('');
  }

  // Render signals on homepage
  const signalFeed = document.getElementById('signalFeed');
  if (signalFeed) {
    const recentSignals = allEntries.filter(e => e.type === 'signal').slice(0, 5);
    signalFeed.innerHTML = recentSignals.map(e => `
      <div class="signal-item">
        <span class="signal-time">${timeAgo(e.timestamp)}</span>
        <span class="signal-title">${e.title}</span>
        <span class="signal-badge live">LIVE</span>
      </div>
    `).join('');
  }

  // Render failed tests on homepage
  const failedFeed = document.getElementById('failedFeed');
  if (failedFeed) {
    const recentFailed = allEntries.filter(e => e.type === 'failed').slice(0, 3);
    failedFeed.innerHTML = recentFailed.map(e => `
      <div class="failed-item">
        <div class="failed-title">${e.title}</div>
        <div class="failed-detail">${e.content}</div>
      </div>
    `).join('');
  }

  // Render failed tests on failed-tests page
  const failedTestsList = document.getElementById('failedTestsList');
  if (failedTestsList) {
    failedTestsList.innerHTML = failedData.map(e => `
      <div class="failed-item">
        <div class="failed-title">${e.title}</div>
        <div class="failed-detail">${e.content}</div>
      </div>
    `).join('');
  }

  // Render operator notes on homepage
  const operatorFeed = document.getElementById('operatorFeed');
  if (operatorFeed) {
    const recentOperator = allEntries.filter(e => e.type === 'operator').slice(0, 5);
    operatorFeed.innerHTML = recentOperator.map(e => {
      const d = new Date(e.timestamp);
      const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return `
        <div class="operator-item">
          <div class="operator-time">${timeStr}</div>
          <div class="operator-text">${e.content}</div>
        </div>
      `;
    }).join('');
  }

  // Update stats
  const anomalyCount = document.getElementById('anomalyCount');
  const failedCount = document.getElementById('failedCount');
  if (anomalyCount) anomalyCount.textContent = allEntries.filter(e => e.type === 'failed').length;
  if (failedCount) failedCount.textContent = failedData.length;

  // Live simulation: add new entries every 10s
  const terminalStream = document.getElementById('terminalStream');
  const typingLine = document.getElementById('typingLine');
  const typingTime = document.getElementById('typingTime');

  const liveMessages = [
    { tag: '[SIGNAL]', text: 'GPT-5 停顿模式更自然', type: 'signal' },
    { tag: '[ANOMALY]', text: 'Memory drift in Persona #7', type: 'anomaly' },
    { tag: '[SYSTEM]', text: 'Memory re-calibration complete', type: 'system' },
    { tag: '[WARNING]', text: 'DRIFT DETECTED in context window', type: 'warning' },
    { tag: '[OPERATOR]', text: '已记录为观察项', type: 'operator' },
    { tag: '[FAILED]', text: 'FAILED TEST — Persona sync timeout', type: 'failed' },
    { tag: '[SIGNAL]', text: 'Claude 情绪表达稳定性强', type: 'signal' },
    { tag: '[SYSTEM]', text: 'Agent-3 restored', type: 'system' },
    { tag: '[WARNING]', text: 'SIGNAL LOST — heartbeat timeout', type: 'warning' },
    { tag: '[ANOMALY]', text: 'Context collapse detected', type: 'anomaly' },
  ];

  setInterval(() => {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);
    const msg = liveMessages[Math.floor(Math.random() * liveMessages.length)];

    const newLine = document.createElement('div');
    newLine.className = `stream-line ${msg.type}`;
    newLine.innerHTML = `
      <span class="stream-time">${timeStr}</span>
      <span class="stream-tag">${msg.tag}</span>
      <span class="stream-text">${msg.text}</span>
    `;

    if (typingLine && terminalStream) {
      terminalStream.insertBefore(newLine, typingLine);
    } else if (terminalStream) {
      terminalStream.appendChild(newLine);
    }

    if (typingTime) {
      typingTime.textContent = now.toTimeString().slice(0, 7) + ':';
    }

    if (terminalStream) {
      const lines = terminalStream.querySelectorAll('.stream-line:not(.typing)');
      if (lines.length > 20) {
        lines[0].remove();
      }
    }
  }, 10000);
});