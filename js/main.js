document.addEventListener('DOMContentLoaded',function(){
  // Core data
  const feed = document.getElementById('signalFeed') || document.getElementById('signalList');
  const mainTitle = document.getElementById('mainSignalTitle');
  const mainTime = document.getElementById('mainSignalTime');
  const mainNote = document.getElementById('mainSignalNote');
  const mainDetail = document.getElementById('mainSignalDetail');
  const failedSummary = document.getElementById('failedSummary');
  const operatorLast = document.getElementById('operatorLastTime');

  const sampleSignals = [
    {ts:Date.now()-1000*60*60, title:'NEURAL SIGNAL #041', note:'Claude 在 200K context 出现情绪重复', detail:'观察到在长上下文中出现重复表述，需进一步校验记忆缓存。', type:'signal'},
    {ts:Date.now()-1000*60*40, title:'Agent #3 Sync', note:'自动恢复', detail:'Agent #3 在同步失败后重试并恢复，疑似网络抖动触发。', type:'signal'},
    {ts:Date.now()-1000*60*20, title:'FAILED TEST #018', note:'Hermes 人格偏移', detail:'Hermes 在连续运行 14 小时后开始重复自我描述，记录为失败。', type:'failed'}
  ];

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
