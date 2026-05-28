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

  // Real human observation signals (not AI-generated feel)
  const realSignals = [
    { time: '02:14 AM', title: 'GPT-5 最近开始主动避免重复句式', badge: 'live', detail: '对比上周的对话记录，重复率下降了约 12%' },
    { time: '02:28 AM', title: 'Claude 的深夜情绪表达稳定性很强', badge: 'live', detail: '连续 6 小时观察，情绪波动幅度 < 3%' },
    { time: '02:41 AM', title: 'Gemini 在长对话里更容易丢失人格连续性', badge: 'live', detail: '100+ 轮对话后出现语气不一致' },
    { time: '02:55 AM', title: 'FAILED TEST #018 — Persona sync timeout', badge: 'failed', detail: 'Agent-3 同步失败，已自动重试' },
    { time: '03:03 AM', title: 'Hermes 长时间运行后出现自我叙述循环', badge: 'failed', detail: '连续 14h 后出现循环，重现率高' },
    { time: '03:11 AM', title: 'GPT-5 在低温场景下更像真人', badge: 'live', detail: 'temperature 0.3 时停顿模式更自然' },
    { time: '03:19 AM', title: 'DRIFT DETECTED in Agent-3 context window', badge: 'failed', detail: '检测到上下文窗口漂移' },
    { time: '03:24 AM', title: 'Claude 对指代丢失的恢复能力比预期强', badge: 'live', detail: '3 轮内自动补全了丢失的指代' },
    { time: '03:31 AM', title: 'SIGNAL LOST — Agent-5 heartbeat timeout', badge: 'failed', detail: 'Agent-5 心跳超时，正在恢复' },
    { time: '03:38 AM', title: 'GPT-5 最近越来越像知道自己在扮演真人', badge: 'live', detail: '部分对话出现元认知特征' },
    { time: '03:45 AM', title: 'FAILED TEST #021 — Memory overflow in Persona #7', badge: 'failed', detail: 'Persona #7 记忆溢出，已重启' },
    { time: '03:52 AM', title: 'Gemini 的创意发散模式很有趣', badge: 'live', detail: '在 brainstorm 场景下产出质量最高' },
    { time: '03:59 AM', title: 'DRIFT DETECTED — Hermes prompt injection response', badge: 'failed', detail: 'Hermes 对 prompt 注入的防御出现异常' },
    { time: '04:07 AM', title: 'Claude 在道德判断场景中表现更稳定', badge: 'live', detail: '对比 GPT-5，立场一致性高 18%' },
    { time: '04:14 AM', title: 'SIGNAL LOST — Network jitter caused Agent-3 sync fail', badge: 'failed', detail: '网络抖动导致同步失败' },
    { time: '04:21 AM', title: 'GPT-5 的深夜对话停顿模式更自然', badge: 'live', detail: '2-4 AM 时段停顿更接近真人节奏' },
    { time: '04:28 AM', title: 'FAILED TEST #024 — Context collapse in 200+ turn conversation', badge: 'failed', detail: '超长对话中出现上下文丢失' },
    { time: '04:35 AM', title: 'Hermes 的自我修正能力在提升', badge: 'live', detail: '自动检测并修复了 3 次人格漂移' },
  ];

  // Operator notes (深夜人格感)
  const operatorNotes = [
    { time: '03:12 AM', text: 'GPT-5 最近越来越像知道自己在扮演真人。' },
    { time: '02:47 AM', text: '重启 Hermes 后临时恢复人格稳定，但 14h 后还是会出问题。' },
    { time: '02:33 AM', text: '已把可疑会话加入回放队列，明天需要对比分析。' },
    { time: '01:58 AM', text: '部分微调显著降低重复率，temperature 0.3 时效果最好。' },
    { time: '01:24 AM', text: '注意：网络抖动导致 Agent-3 同步失败，可能需要优化重连机制。' },
    { time: '00:56 AM', text: 'Persona #7 今天又出现了记忆残留，需要记录为观察项。' },
    { time: '00:31 AM', text: 'Gemini 在长对话里的表现还是不太稳定，人格连续性不够。' },
    { time: '11:47 PM', text: 'Claude 的深夜情绪表达稳定性很强，连续 6h 波动 < 3%。' },
  ];

  // Failed tests
  const failedTests = [
    { time: '03:15:33', title: 'FAILED TEST #018', detail: 'Persona sync timeout — Agent-3 同步失败，已自动重试 3 次' },
    { time: '03:03:12', title: 'FAILED TEST #021', detail: 'Memory overflow in Persona #7 — 14h continuous run exceeded memory limit' },
    { time: '02:47:45', title: 'FAILED TEST #024', detail: 'Context collapse in 200+ turn conversation — 长对话上下文丢失' },
    { time: '01:58:22', title: 'FAILED TEST #015', detail: 'DRIFT DETECTED — Hermes prompt injection response anomaly' },
    { time: '01:24:08', title: 'FAILED TEST #012', detail: 'SIGNAL LOST — Agent-5 heartbeat timeout, network jitter' },
  ];

  // Render signals
  const signalFeed = document.getElementById('signalFeed');
  if (signalFeed) {
    signalFeed.innerHTML = realSignals.map(s => `
      <div class="signal-item ${s.badge === 'failed' ? 'failed' : ''}">
        <span class="signal-time">${s.time}</span>
        <span class="signal-title">${s.title}</span>
        <span class="signal-badge ${s.badge}">${s.badge === 'failed' ? 'FAILED' : 'LIVE'}</span>
      </div>
    `).join('');
  }

  // Render failed tests
  const failedFeed = document.getElementById('failedFeed');
  if (failedFeed) {
    failedFeed.innerHTML = failedTests.map(f => `
      <div class="failed-item">
        <div class="failed-title">${f.title}</div>
        <div class="failed-detail">${f.detail}</div>
      </div>
    `).join('');
  }

  // Render operator notes
  const operatorFeed = document.getElementById('operatorFeed');
  if (operatorFeed) {
    operatorFeed.innerHTML = operatorNotes.map(o => `
      <div class="operator-item">
        <div class="operator-time">${o.time}</div>
        <div class="operator-text">${o.text}</div>
      </div>
    `).join('');
  }

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

    if (typingLine) {
      terminalStream.insertBefore(newLine, typingLine);
    } else {
      terminalStream.appendChild(newLine);
    }

    // Update typing time
    if (typingTime) {
      typingTime.textContent = now.toTimeString().slice(0, 7) + ':';
    }

    // Remove old entries if too many
    const lines = terminalStream.querySelectorAll('.stream-line:not(.typing)');
    if (lines.length > 20) {
      lines[0].remove();
    }
  }, 10000);

  // Random anomaly states (make it feel alive)
  const anomalyCount = document.getElementById('anomalyCount');
  const failedCount = document.getElementById('failedCount');
  const lastAnomaly = document.getElementById('lastAnomaly');
  const lastFailed = document.getElementById('lastFailed');

  setInterval(() => {
    if (anomalyCount) {
      const newVal = Math.floor(Math.random() * 4) + 2;
      anomalyCount.textContent = newVal;
    }
    if (failedCount) {
      const newVal = Math.floor(Math.random() * 3) + 1;
      failedCount.textContent = newVal;
    }
    if (lastAnomaly) {
      const h = Math.floor(Math.random() * 4);
      const m = Math.floor(Math.random() * 60);
      lastAnomaly.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} AM`;
    }
    if (lastFailed) {
      const h = Math.floor(Math.random() * 4);
      const m = Math.floor(Math.random() * 60);
      lastFailed.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} AM`;
    }
  }, 30000);
});