document.addEventListener('DOMContentLoaded',function(){
  // Simulate live signals feed
  const feed = document.getElementById('signalFeed') || document.getElementById('signalList') || document.getElementById('signalList');
  const sampleSignals = [
    {time:'03:14', title:'NEURAL SIGNAL #041', content:'Claude 在长上下文中出现轻微人格漂移。'},
    {time:'09:15', title:'GPT-5 Context Update', content:'Context window stability improved at 200k tokens.'},
    {time:'14:33', title:'Agent #3 Recovery', content:'Agent #3 restored after sync.'}
  ];

  function renderSignals(target, items){
    if(!target) return;
    target.innerHTML = items.map(i=>`<div class="signal"><div class="meta">${i.time} · ${i.title}</div><div class="txt">${i.content}</div></div>`).join('');
  }

  // initial render
  if(feed) renderSignals(feed, sampleSignals);

  // live simulation: append a new random signal every 12s
  setInterval(()=>{
    const now = new Date();
    const t = now.toTimeString().slice(0,5);
    const item = {time:t, title:'NEURAL SIGNAL', content:'自动观测：短期人格波动记录'};
    sampleSignals.unshift(item);
    sampleSignals.splice(5);
    renderSignals(feed, sampleSignals);
  },12000);
});
