document.addEventListener('DOMContentLoaded',async function(){
  // Core data
  const feed = document.getElementById('signalFeed') || document.getElementById('signalList');
  const mainTitle = document.getElementById('mainSignalTitle');
  const mainTime = document.getElementById('mainSignalTime');
  const mainNote = document.getElementById('mainSignalNote');
  const mainDetail = document.getElementById('mainSignalDetail');
  const failedSummary = document.getElementById('failedSummary');
  const operatorLast = document.getElementById('operatorLastTime');

  const now = Date.now();
    // 生成长期时间流：100 条信号（包含失败日志的若干条），风格为短碎片观测
    function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    const signalSeeds = [
      '在长上下文中出现重复表述',
      '模仿真人停顿更自然',
      '情绪表达出现微弱放大',
      '对话指代出现丢失',
      '人格语气轻微漂移',
      '在线微调后稳定性提升',
      '在低温可用场景表现欠佳',
      '对连续多轮用户输入响应变慢',
      '短期记忆丢失（指代错位）',
      '生成中出现事实性错误率升高'
    ];

    const agentNames = ['Hermes','Athena','Claude','Gemini','GPT-5','Orion','Agent-3'];
    const signalTypes = ['signal','signal','signal','failed']; // 加一点失败概率

    function genTitle(i, kind) {
      if (kind === 'failed') return `FAILED TEST #${String(1000 + i).slice(1)}`;
      return `NEURAL SIGNAL #${String(100 + i)}`;
    }

    function genDetail(seed, name) {
      const extras = [
        '已记录为观察项，需 48 小时回放验证。',
        '怀疑与长上下文触发器有关，已加入复盘队列。',
        '优先级：中。可能与 prompt 长度、token 分割策略相关。',
        '建议：采集 10 次复现样本，使用统一 prompt 模板重放。',
        '可能由内存漂移导致，计划重启并对比。'
      ];
      return `${name} — ${seed} ${pick(extras)}`;
    }

    function generateSignals(n) {
      const out = [];
      for (let i = 0; i < n; i++) {
        // 时间分布：过去 180 天内，偏向最近
        const daysAgo = Math.pow(Math.random(), 1.2) * 180;
        const ts = now - Math.floor(daysAgo * 24 * 60 * 60 * 1000) - randInt(0, 24*60*60*1000);
        const kind = pick(signalTypes);
        const agent = pick(agentNames);
        const seed = pick(signalSeeds);
        const title = genTitle(i, kind);
        const note = `${agent} ${seed.split(' ')[0]}`;
        const detail = genDetail(seed, agent);
        out.push({ts, title, note, detail, type: kind});
      }
      // 确保近期有若干明显条目
      out.push({ts: now - 1000*60*60*2, title: 'NEURAL SIGNAL #RECENT', note: 'GPT-5 最近更会模仿真人停顿。', detail: '短观察：部分对话在停顿时更自然，需长期跟踪。', type: 'signal'});
      out.push({ts: now - 1000*60*10, title: 'FAILED TEST #RECENT', note: 'Hermes 长时间运行后出现自我叙述循环。', detail: '连续运行 14 小时后出现循环，重现率高。', type: 'failed'});
      // 排序：最新在前
      out.sort((a,b) => b.ts - a.ts);
      return out;
    }

    const sampleSignals = generateSignals(100);

    // 提取失败日志和 Operator 日志样本
    const failedLogs = sampleSignals.filter(s => s.type === 'failed').slice(0, 30);

    // 生成简短的 Operator 日志（用于 operator 面板）
    const operatorNotes = [
      '03:12 AM — 观察：GPT-5 最近越来越像知道自己在扮演真人。',
      '11:47 PM — 重启 Hermes 后临时恢复人格稳定。',
      '02:05 AM — 已把可疑会话加入回放队列。',
      '07:30 AM — 部分微调显著降低重复率。',
      '04:20 PM — 注意：网络抖动导致 Agent-3 同步失败。'
    ];

    const operatorLogs = operatorNotes.map((t,i)=>({ts: now - i*1000*60*60, text: t}));

    // 尝试从 data/*.json 加载外部数据（覆盖内置生成器），便于后续维护
    async function loadJSON(path){
      try{
        const res = await fetch(path, {cache: 'no-store'});
        if(!res.ok) return null;
        return await res.json();
      }catch(e){
        return null;
      }
    }

    async function tryLoadData(){
      const extSignals = await loadJSON('data/signals.json');
      if(extSignals && Array.isArray(extSignals) && extSignals.length){
        // map to internal sampleSignals structure
        const mapped = extSignals.map(s=>({
          ts: s.timestamp ? Date.parse(s.timestamp) : Date.now(),
          title: s.title || (s.model?`${s.model} ${s.id || ''}`:'Signal'),
          note: s.model || '',
          detail: s.content || '',
          type: (s.type==='failed' || s.status==='failed')? 'failed' : (s.type || 'signal')
        }));
        // sort newest first
        mapped.sort((a,b)=>b.ts-a.ts);
        sampleSignals.splice(0, sampleSignals.length, ...mapped);
      }

      const extFailed = await loadJSON('data/failed-tests.json');
      if(extFailed && Array.isArray(extFailed)){
        // provide failedLogs for pages that use it
        failedLogs.splice(0, failedLogs.length, ...extFailed.map(f=>({
          ts: f.timestamp ? Date.parse(f.timestamp) : Date.now(),
          title: f.title || (`FAILED TEST #${f.id||'?'}`),
          note: f.model || '',
          detail: f.content || '',
          severity: f.severity || 'warning'
        })));
      }

      const extOp = await loadJSON('data/operator-logs.json');
      if(extOp && Array.isArray(extOp)){
        operatorLogs.splice(0, operatorLogs.length, ...extOp.map(o=>({ts: o.timestamp?Date.parse(o.timestamp):Date.now(), text: (o.operator?o.operator+': ':'')+o.content})));
      }
    }

  let operatorState = {name:'Neural', state:'ONLINE', focus:['Persona Drift','Agent Memory'], lastActive:Date.now()-1000*60*5};

  function fmtTime(ts){
    const d = new Date(ts);
    return d.toISOString().replace('T',' ').slice(0,19);
  }

  function renderMain(){
    const primary = sampleSignals.find(s=>s.type==='signal') || sampleSignals[0];
    if(primary){
      if(mainTitle) mainTitle.textContent = primary.title;
      if(mainTime) mainTime.textContent = fmtTime(primary.ts);
      if(mainNote) mainNote.textContent = primary.note;
      if(mainDetail) mainDetail.textContent = primary.detail;
    }
  }

  function renderFeed(){
    if(!feed) return;
    feed.innerHTML = sampleSignals.map(s=>`<div class="signal ${s.type==='failed'?'failed':''}"><div class="meta">${fmtTime(s.ts)} · ${s.title}</div><div class="txt">${s.detail}</div></div>`).join('');
  }

  function renderFailedSummary(){
    if(!failedSummary) return;
    const failed = sampleSignals.filter(s=>s.type==='failed');
    failedSummary.innerHTML = failed.map(f=>`<div class="failed-log"><div class="meta">${fmtTime(f.ts)} · ${f.title}</div><pre>${f.detail}</pre></div>`).join('');
  }

  function renderOperator(){
    if(operatorLast) operatorLast.textContent = fmtTime(operatorState.lastActive);
    const opName = document.getElementById('operatorName');
    const opNamePanel = document.getElementById('operatorNamePanel');
    const opState = document.getElementById('operatorState');
    const opFocus = document.getElementById('operatorFocus');
    if(opName) opName.textContent = operatorState.name;
    if(opNamePanel) opNamePanel.textContent = operatorState.name;
    if(opState) opState.textContent = operatorState.state;
    if(opFocus) opFocus.textContent = 'Focus: ' + operatorState.focus.join(' · ');
  }

  // Initial render
  await tryLoadData();
  renderMain();
  renderFeed();
  renderFailedSummary();
  renderOperator();

  // Live simulation: add a new random small observation every 10s
  setInterval(()=>{
    const now = Date.now();
    const seed = Math.random();
    if(seed>0.85){
      // failed event
      sampleSignals.unshift({ts:now, title:'FAILED TEST #'+(100+Math.floor(Math.random()*900)), note:'自动检测到异常', detail:'实验运行异常样本：出现内存溢出或人格漂移。', type:'failed'});
    } else {
      sampleSignals.unshift({ts:now, title:'NEURAL SIGNAL', note:'自动观测', detail:'短期观测：检测到微小漂移。', type:'signal'});
    }
    sampleSignals.splice(10);
    operatorState.lastActive = now;
    renderMain(); renderFeed(); renderFailedSummary(); renderOperator();
  },10000);
});
