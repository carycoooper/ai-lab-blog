async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) return [];
    return await res.json();
}

function renderEntry(entry) {
    const div = document.createElement('div');
    div.classList.add('entry');
    div.classList.add('type-' + entry.type);

    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    const date = new Date(entry.timestamp);
    timestamp.textContent = date.toLocaleString();
    div.appendChild(timestamp);

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = entry.content;
    div.appendChild(content);

    return div;
}

async function initTimeline(homepage = true) {
    const timelineEl = document.getElementById('timeline');
    if (!timelineEl) return;

    // Clear loading
    timelineEl.innerHTML = '';

    const signals = await loadJSON('data/signals.json');
    const failedLogs = await loadJSON('data/failed-tests.json');
    const operatorLogs = await loadJSON('data/operator-logs.json');

    let allEntries = [
        ...signals.map(e => ({ ...e, type: 'signal' })),
        ...failedLogs.map(e => ({ ...e, type: 'failed' })),
        ...operatorLogs.map(e => ({ ...e, type: 'operator' }))
    ];

    allEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    let displayEntries = allEntries;
    if (homepage) {
        // 首页显示最新 5 条 Signals、3 条 Failed、5 条 Operator
        displayEntries = [
            ...allEntries.filter(e => e.type === 'signal').slice(0, 5),
            ...allEntries.filter(e => e.type === 'failed').slice(0, 3),
            ...allEntries.filter(e => e.type === 'operator').slice(0, 5)
        ];
        displayEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    displayEntries.forEach(entry => timelineEl.appendChild(renderEntry(entry)));

    // 模拟实时条目，10~30 秒随机插入
    setInterval(() => {
        const randomEntry = allEntries[Math.floor(Math.random() * allEntries.length)];
        const newEntry = { ...randomEntry, timestamp: new Date().toISOString() };
        timelineEl.insertBefore(renderEntry(newEntry), timelineEl.firstChild);
    }, Math.floor(Math.random() * 20000) + 10000);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => initTimeline(true));