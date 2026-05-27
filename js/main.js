document.addEventListener('DOMContentLoaded',function(){
  // Core data
  const feed = document.getElementById('signalFeed') || document.getElementById('signalList');
  const mainTitle = document.getElementById('mainSignalTitle');
  const mainTime = document.getElementById('mainSignalTime');
  const mainNote = document.getElementById('mainSignalNote');
  const mainDetail = document.getElementById('mainSignalDetail');
  const failedSummary = document.getElementById('failedSummary');
  const operatorLast = document.getElementById('operatorLastTime');

  const now = Date.now();
  const sampleSignals = [
    {ts:now-1000*60*60*24, title:'NEURAL SIGNAL #035', note:'GPT-5 在长会话出现微弱情绪回环', detail:'记录：在接近 180k tokens 时，模型出现短暂的情绪重复，需回放会话以定位触发上下文。', type:'signal'},
    {ts:now-1000*60*60*14, title:'FAILED TEST #012', note:'训练中断', detail:'训练作业在第42小时被OOM中断；怀疑数据流水异常导致内存峰值。', type:'failed'},
    {ts:now-1000*60*60*8, title:'NEURAL SIGNAL #041', note:'Claude 在 200K context 出现情绪重复', detail:'观察到在长上下文中出现重复表述，需进一步校验记忆缓存。', type:'signal'},
    {ts:now-1000*60*60*6, title:'Agent #3 Sync', note:'自动恢复', detail:'Agent #3 在同步失败后重试并恢复，疑似网络抖动触发。', type:'signal'},
    {ts:now-1000*60*60*4, title:'NEURAL SIGNAL #042', note:'短期漂移检测', detail:'检测到在对话中角色语气轻微偏移，标记为观察项并加入校准队列。', type:'signal'},
    {ts:now-1000*60*60*2, title:'FAILED TEST #018', note:'Hermes 人格偏移', detail:'Hermes 在连续运行 14 小时后开始重复自我描述，记录为失败。', type:'failed'},
    {ts:now-1000*60*30, title:'NEURAL SIGNAL #050', note:'在线微调完成，初步稳定', detail:'对Persona #7 应用微调后，初步稳定性提升；继续观察 48 小时。', type:'signal'},
    {ts:now-1000*60*10, title:'NEURAL SIGNAL #051', note:'探测到轻度记忆漂移', detail:'短时间内多轮对话出现指代错位，已加入修复列表。', type:'signal'}
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
