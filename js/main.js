/* AI LAB V2 - Observation Terminal */
const VERSION = "v5";
const PAGE_SIZE = 24;

let state = {
  allEntries: [],
  filteredEntries: [],
  renderedCount: 0,
  isArchive: false,
  filter: "all",
  searchTerm: "",
  runtimeMinutes: 0
};

async function loadJSON(path) {
  try {
    const res = await fetch(`${path}?v=${VERSION}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function formatTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDate(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function entryDriftClass(entry) {
  const seed = new Date(entry.timestamp).getMinutes() % 4;
  return ["drift-a", "drift-b", "drift-c", "drift-d"][seed];
}

function renderEntry(entry) {
  const wrap = document.createElement("div");
  wrap.className = `timeline-entry ${entry.type || "signal"} ${entryDriftClass(entry)}`;
  if (!entry.content || !entry.content.trim()) wrap.classList.add("blank");
  if ((entry.content || "").includes("[ entry corrupted ]")) wrap.classList.add("corrupted");

  const time = document.createElement("div");
  time.className = "timeline-time";
  time.textContent = `${formatTime(entry.timestamp)} - ${formatDate(entry.timestamp)}`;

  const content = document.createElement("div");
  content.className = `timeline-content ${entry.type || "signal"}`;
  content.textContent = entry.content || "";

  wrap.appendChild(time);
  wrap.appendChild(content);
  return wrap;
}

function applyFilters() {
  const term = state.searchTerm.trim().toLowerCase();
  state.filteredEntries = state.allEntries.filter((e) => {
    if (state.filter !== "all" && e.type !== state.filter) return false;
    if (term && !e.content.toLowerCase().includes(term)) return false;
    return true;
  });
}

function appendNextPage(container) {
  if (state.renderedCount >= state.filteredEntries.length) return;
  const next = state.filteredEntries.slice(state.renderedCount, state.renderedCount + PAGE_SIZE);
  state.renderedCount += next.length;

  next.forEach((entry) => container.appendChild(renderEntry(entry)));
}

function rerender(container) {
  container.innerHTML = "";
  state.renderedCount = 0;
  applyFilters();

  if (state.filteredEntries.length === 0) {
    container.innerHTML = '<div class="loading">no entries found</div>';
    return;
  }
  appendNextPage(container);
}

function setupInfiniteScroll(container) {
  if (!state.isArchive) return;
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 160) {
      appendNextPage(container);
    }
  });
}

function scheduleRealtime(container) {
  const intervals = [7000, 18000, 43000, 120000];
  const wait = intervals[Math.floor(Math.random() * intervals.length)];

  setTimeout(() => {
    const longPause = Math.random() < 0.22;
    if (longPause) {
      const lost = {
        timestamp: new Date().toISOString(),
        content: "SIGNAL LOST",
        type: "critical"
      };
      container.insertBefore(renderEntry(lost), container.firstChild);
      const resumeDelay = 12000 + Math.floor(Math.random() * 26000);
      setTimeout(() => {
        const resumed = {
          timestamp: new Date().toISOString(),
          content: "feed resumed",
          type: "failed"
        };
        container.insertBefore(renderEntry(resumed), container.firstChild);
      }, resumeDelay);
      scheduleRealtime(container);
      return;
    }

    const noop = Math.random() < 0.42;
    if (!noop) {
      const anomalyBurst = Math.random() < 0.14;
      const source = anomalyBurst
        ? state.allEntries.filter((e) => e.type === "critical" || e.type === "failed")
        : state.allEntries;
      const pick = source[Math.floor(Math.random() * source.length)] || state.allEntries[0];

      let nowEntry = {
        ...pick,
        timestamp: new Date().toISOString()
      };
      if (Math.random() < 0.08) {
        nowEntry = { ...nowEntry, content: "" };
      }

      const top = renderEntry(nowEntry);
      container.insertBefore(top, container.firstChild);
      if (!state.isArchive && container.children.length > 20) container.removeChild(container.lastChild);
    }
    scheduleRealtime(container);
  }, wait);
}

function setupControls(container) {
  const buttons = document.querySelectorAll(".filter-btn");
  const search = document.querySelector(".search-input");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.filter = btn.getAttribute("data-filter") || "all";
      rerender(container);
    });
  });

  if (search) {
    let timer;
    search.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.searchTerm = search.value || "";
        rerender(container);
      }, 260);
    });
  }
}

function bootRuntime() {
  const el = document.getElementById("runtime-mark");
  if (!el) return;
  state.runtimeMinutes = 57 * 60 + 13;
  setInterval(() => {
    state.runtimeMinutes += 1;
    const h = Math.floor(state.runtimeMinutes / 60);
    const m = state.runtimeMinutes % 60;
    el.textContent = `runtime: ${h}h ${String(m).padStart(2, "0")}m`;
  }, 60000);
  const h = Math.floor(state.runtimeMinutes / 60);
  const m = state.runtimeMinutes % 60;
  el.textContent = `runtime: ${h}h ${String(m).padStart(2, "0")}m`;
}

async function init() {
  const container = document.getElementById("timeline");
  if (!container) return;
  container.innerHTML = '<div class="loading">loading timeline...</div>';

  state.isArchive = !!document.getElementById("archive-controls");
  const [signals, failed, logs, anomalies] = await Promise.all([
    loadJSON("data/signals.json"),
    loadJSON("data/failed-tests.json"),
    loadJSON("data/operator-logs.json"),
    loadJSON("data/anomalies.json")
  ]);

  state.allEntries = [
    ...signals.map((e) => ({ ...e, type: "signal" })),
    ...failed.map((e) => ({ ...e, type: e.severity === "critical" ? "critical" : "failed" })),
    ...logs.map((e) => ({ ...e, type: "operator" })),
    ...anomalies.map((e) => ({ ...e, type: e.severity === "critical" ? "critical" : "failed" }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!state.isArchive) state.filteredEntries = state.allEntries.slice(0, 15);
  else state.filteredEntries = state.allEntries.slice();

  rerender(container);
  if (state.isArchive) setupControls(container);
  setupInfiniteScroll(container);
  scheduleRealtime(container);
  bootRuntime();
}

document.addEventListener("DOMContentLoaded", init);
