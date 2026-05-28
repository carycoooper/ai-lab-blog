/* AI LAB V2 — FINAL REBUILD */
/* Long-running AI Observation Terminal */

const VERSION = 'v2';

async function loadJSON(path) {
  try {
    const res = await fetch(path + '?v=' + VERSION);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.warn('Failed to load:', path);
    return [];
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function renderEntry(entry) {
  const div = document.createElement('div');
  div.className = `timeline-entry ${entry.type || 'signal'}`;
  div.setAttribute('data-type', entry.type || 'signal');
  
  const timeEl = document.createElement('div');
  timeEl.className = 'timeline-time';
  timeEl.textContent = formatTime(entry.timestamp) + ' — ' + formatDate(entry.timestamp);
  div.appendChild(timeEl);
  
  const contentEl = document.createElement('div');
  contentEl.className = `timeline-content ${entry.type || 'signal'}`;
  contentEl.textContent = entry.content;
  div.appendChild(contentEl);
  
  return div;
}

async function initTimeline(options = {}) {
  const {
    containerId = 'timeline',
    showAll = false,
    limit = 15,
    filter = null,
    searchTerm = null
  } = options;
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '<div class="loading">loading timeline...</div>';
  
  // Load all data
  const [signals, failedTests, operatorLogs, anomalies] = await Promise.all([
    loadJSON('data/signals.json'),
    loadJSON('data/failed-tests.json'),
    loadJSON('data/operator-logs.json'),
    loadJSON('data/anomalies.json')
  ]);
  
  // Combine all entries
  let allEntries = [
    ...signals.map(e => ({ ...e, type: 'signal' })),
    ...failedTests.map(e => ({ ...e, type: e.severity === 'critical' ? 'critical' : 'failed' })),
    ...operatorLogs.map(e => ({ ...e, type: 'operator' })),
    ...anomalies.map(e => ({ ...e, type: e.severity === 'critical' ? 'critical' : 'failed' }))
  ];
  
  // Sort by timestamp descending
  allEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Apply filter
  if (filter && filter !== 'all') {
    allEntries = allEntries.filter(e => e.type === filter);
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    allEntries = allEntries.filter(e => e.content.toLowerCase().includes(term));
  }
  
  // Clear loading
  container.innerHTML = '';
  
  // Limit entries for homepage
  const displayEntries = showAll ? allEntries : allEntries.slice(0, limit);
  
  if (displayEntries.length === 0) {
    container.innerHTML = '<div class="loading">no entries found</div>';
    return;
  }
  
  // Render entries
  let lastDate = null;
  displayEntries.forEach((entry, index) => {
    const entryDate = formatDate(entry.timestamp);
    
    // Add date divider
    if (entryDate !== lastDate) {
      if (lastDate !== null) {
        const divider = document.createElement('div');
        divider.className = 'timeline-divider';
        container.appendChild(divider);
      }
      lastDate = entryDate;
    }
    
    container.appendChild(renderEntry(entry));
  });
  
  // Store all entries for real-time updates
  window.allEntries = allEntries;
  
  // Start real-time simulation with random intervals
  startRealTimeSimulation(container);
}

function startRealTimeSimulation(container) {
  if (!window.allEntries || window.allEntries.length === 0) return;
  
  function scheduleNext() {
    // Random interval: 7s, 19s, 43s, 120s (sometimes nothing updates)
    const intervals = [7000, 19000, 43000, 120000];
    const delay = intervals[Math.floor(Math.random() * intervals.length)];
    
    setTimeout(() => {
      // 70% chance to add new entry, 30% chance to do nothing
      if (Math.random() > 0.3) {
        const randomEntry = window.allEntries[Math.floor(Math.random() * window.allEntries.length)];
        const newEntry = {
          ...randomEntry,
          timestamp: new Date().toISOString()
        };
        
        const entryEl = renderEntry(newEntry);
        container.insertBefore(entryEl, container.firstChild);
        
        // Remove last entry if too many
        if (container.children.length > 20) {
          container.removeChild(container.lastChild);
        }
      }
      
      // Schedule next update
      scheduleNext();
    }, delay);
  }
  
  scheduleNext();
}

// Filter and search for archive page
function setupArchiveControls() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('.search-input');
  
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Re-render with filter
        const filter = btn.getAttribute('data-filter');
        initTimeline({
          containerId: 'timeline',
          showAll: true,
          filter: filter,
          searchTerm: searchInput?.value || null
        });
      });
    });
  }
  
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const activeFilter = document.querySelector('.filter-btn.active');
        const filter = activeFilter?.getAttribute('data-filter') || 'all';
        
        initTimeline({
          containerId: 'timeline',
          showAll: true,
          filter: filter,
          searchTerm: searchInput.value
        });
      }, 300);
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check if this is archive page
  const isArchive = document.getElementById('archive-controls');
  
  if (isArchive) {
    initTimeline({
      containerId: 'timeline',
      showAll: true
    });
    setupArchiveControls();
  } else {
    initTimeline({
      containerId: 'timeline',
      showAll: false,
      limit: 15
    });
  }
  
  // Update clock
  function updateClock() {
    const clockEl = document.getElementById('site-time');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
  }
  setInterval(updateClock, 1000);
  updateClock();
});