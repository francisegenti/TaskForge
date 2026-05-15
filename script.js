/**
 * ============================================================
 * TaskForge — script.js
 * Author : Francis Egenti | DevOps Engineer
 * Version: 1.0.0
 * ============================================================
 */

'use strict';

/* ============================================================
   1. STATE & LOCALSTORAGE
   ============================================================ */

const State = { tasks: [], projects: [], activity: [] };

const STORAGE_KEYS = {
  TASKS:    'tf_tasks',
  PROJECTS: 'tf_projects',
  ACTIVITY: 'tf_activity',
  THEME:    'tf_theme',
  PREFS:    'tf_prefs',
};

function persist() {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS,    JSON.stringify(State.tasks));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(State.projects));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(State.activity));
  } catch (e) { console.error('TaskForge: localStorage write failed', e); }
}

function hydrate() {
  try {
    State.tasks    = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS))    || [];
    State.projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS)) || [];
    State.activity = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY)) || [];
  } catch (e) { State.tasks = []; State.projects = []; State.activity = []; }
}

/* ============================================================
   2. SAMPLE DATA
   ============================================================ */

function loadSampleData(force = false) {
  if (!force && State.tasks.length > 0) return;
  if (force && State.tasks.length > 0) {
    if (!confirm('This will replace existing data. Continue?')) return;
  }

  const today   = new Date();
  const addDays = (d) => new Date(today.getTime() + d * 86400000).toISOString().split('T')[0];

  State.projects = [
    { id: uid(), name: 'Platform Redesign',   desc: 'Complete UI/UX overhaul of the main platform', icon: '🚀', color: '#6366f1', createdAt: Date.now() },
    { id: uid(), name: 'API Integration Hub', desc: 'Build and document all third-party API connectors', icon: '🌐', color: '#14b8a6', createdAt: Date.now() },
    { id: uid(), name: 'Security Audit',      desc: 'Quarterly penetration testing and vulnerability review', icon: '🔒', color: '#f43f5e', createdAt: Date.now() },
    { id: uid(), name: 'Mobile App v2',       desc: 'React Native rewrite with offline-first support', icon: '📱', color: '#a855f7', createdAt: Date.now() },
  ];

  State.tasks = [
    { id: uid(), title: 'Set up CI/CD pipeline',       desc: 'Configure GitHub Actions for automated deployment',  status: 'done',        priority: 'high',   due: addDays(-3), labels: ['devops','ci'],       project: State.projects[0].id, createdAt: Date.now() - 5e6 },
    { id: uid(), title: 'Design system tokens',         desc: 'Define color, spacing, typography tokens in Figma', status: 'done',        priority: 'medium', due: addDays(-1), labels: ['design'],            project: State.projects[0].id, createdAt: Date.now() - 4e6 },
    { id: uid(), title: 'OAuth 2.0 implementation',     desc: 'Add Google and GitHub SSO login flows',             status: 'in-progress', priority: 'high',   due: addDays(2),  labels: ['auth','backend'],     project: State.projects[1].id, createdAt: Date.now() - 3e6 },
    { id: uid(), title: 'Write API documentation',      desc: 'OpenAPI 3.0 spec for all public endpoints',         status: 'in-progress', priority: 'medium', due: addDays(4),  labels: ['docs'],               project: State.projects[1].id, createdAt: Date.now() - 2e6 },
    { id: uid(), title: 'SQL injection testing',        desc: 'Test all form inputs against injection attacks',    status: 'todo',        priority: 'high',   due: addDays(1),  labels: ['security','testing'], project: State.projects[2].id, createdAt: Date.now() - 1e6 },
    { id: uid(), title: 'Dashboard component library',  desc: 'Build reusable chart and widget components',        status: 'in-progress', priority: 'medium', due: addDays(5),  labels: ['frontend','react'],   project: State.projects[3].id, createdAt: Date.now() - 8e5 },
    { id: uid(), title: 'Performance profiling',        desc: 'Lighthouse audit and bundle size optimisation',    status: 'todo',        priority: 'low',    due: addDays(7),  labels: ['performance'],        project: State.projects[0].id, createdAt: Date.now() - 6e5 },
    { id: uid(), title: 'SSL certificate renewal',      desc: 'Renew wildcard cert before expiry',                 status: 'todo',        priority: 'high',   due: addDays(-1), labels: ['devops','urgent'],    project: State.projects[2].id, createdAt: Date.now() - 4e5 },
    { id: uid(), title: 'Offline sync strategy',        desc: 'Implement service worker for offline data sync',   status: 'todo',        priority: 'medium', due: addDays(10), labels: ['mobile','pwa'],       project: State.projects[3].id, createdAt: Date.now() - 2e5 },
    { id: uid(), title: 'Write unit tests for auth',    desc: 'Jest tests for login, logout, session management', status: 'done',        priority: 'high',   due: addDays(-2), labels: ['testing','auth'],     project: State.projects[1].id, createdAt: Date.now() - 1e5 },
  ];

  State.activity = [
    { text: 'Task "CI/CD pipeline" marked as Done',        time: '2 min ago',  color: '#10b981' },
    { text: 'New project "Mobile App v2" created',         time: '15 min ago', color: '#6366f1' },
    { text: 'Task "OAuth 2.0 implementation" started',     time: '1 hr ago',   color: '#f59e0b' },
    { text: 'SSL certificate renewal flagged as overdue',  time: '3 hr ago',   color: '#f43f5e' },
    { text: 'Unit tests for auth moved to Done',           time: '5 hr ago',   color: '#10b981' },
  ];

  persist();
  renderAll();
  if (force) showToast('Sample data loaded successfully!', 'success');
}

/* ============================================================
   3. NAVIGATION
   ============================================================ */

let currentPage = 'dashboard';
let chartsInitialized = false;

const NAV_TITLES = {
  dashboard: 'Dashboard', projects: 'Projects',
  kanban: 'Kanban Board', analytics: 'Analytics', settings: 'Settings',
};

function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const navEl  = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) { navEl.classList.add('active'); navEl.setAttribute('aria-current', 'page'); }
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');
  document.getElementById('page-title').textContent  = NAV_TITLES[page] || page;
  document.getElementById('breadcrumb').textContent  = `TaskForge / ${NAV_TITLES[page] || page}`;
  currentPage = page;
  if (page === 'analytics') renderAnalytics();
  closeSidebar();
}

function initNavigation() {
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.page));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') navigateTo(el.dataset.page); });
  });
}

/* ============================================================
   4. THEME
   ============================================================ */

function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const sun  = document.getElementById('theme-icon-sun');
  const moon = document.getElementById('theme-icon-moon');
  if (sun)  sun.style.display  = dark ? 'none' : '';
  if (moon) moon.style.display = dark ? ''     : 'none';
  const toggle = document.getElementById('darkToggle');
  if (toggle) toggle.checked = dark;
  localStorage.setItem(STORAGE_KEYS.THEME, dark ? 'dark' : 'light');
}

function toggleTheme(dark) {
  applyTheme(dark);
  if (currentPage === 'analytics') { chartsInitialized = false; renderAnalytics(); }
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);
  document.getElementById('themeToggle').addEventListener('click', () => {
    toggleTheme(document.documentElement.dataset.theme !== 'dark');
  });
}

/* ============================================================
   5. DASHBOARD
   ============================================================ */

function renderDashboard() {
  renderStats();
  renderRecentTasks();
  renderActivity();
}

function renderStats() {
  const total   = State.tasks.length;
  const done    = State.tasks.filter(t => t.status === 'done').length;
  const inProg  = State.tasks.filter(t => t.status === 'in-progress').length;
  const today   = new Date().toISOString().split('T')[0];
  const overdue = State.tasks.filter(t => t.status !== 'done' && t.due && t.due < today).length;

  document.getElementById('stats-grid').innerHTML = `
    ${statCard('total',    'Total Tasks',  total,  '+2 this week', false,
      `<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`)}
    ${statCard('done',     'Completed',    done,   `${total ? Math.round(done/total*100) : 0}% rate`, false,
      `<polyline points="20 6 9 17 4 12"/>`)}
    ${statCard('progress', 'In Progress',  inProg, 'Active now', false,
      `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`)}
    ${statCard('overdue',  'Overdue',      overdue,overdue > 0 ? 'Needs attention' : 'All on track', overdue > 0,
      `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`)}
  `;
}

function statCard(cls, label, num, change, isNeg, iconPath) {
  return `
  <div class="stat-card ${cls}">
    <div class="stat-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
    </div>
    <div>
      <div class="stat-num">${num}</div>
      <div class="stat-label">${label}</div>
      <div class="stat-change ${isNeg ? 'neg' : ''}">${change}</div>
    </div>
  </div>`;
}

function renderRecentTasks() {
  const el     = document.getElementById('recent-tasks-list');
  const recent = [...State.tasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 7);
  if (!recent.length) {
    el.innerHTML = `<div style="text-align:center;padding:32px;color:var(--text-3)">No tasks yet. Create your first task!</div>`;
    return;
  }
  const today = new Date().toISOString().split('T')[0];
  el.innerHTML = recent.map(t => {
    const overdue = t.status !== 'done' && t.due && t.due < today;
    const checked = t.status === 'done';
    return `
    <div class="task-row">
      <div class="task-check ${checked ? 'checked' : ''}" onclick="toggleTaskDone('${t.id}')" role="checkbox" aria-checked="${checked}" tabindex="0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="task-info">
        <div class="task-title ${checked ? 'done-text' : ''}">${escHtml(t.title)}</div>
        <div class="task-meta">
          ${priorityBadge(t.priority)}
          ${t.labels?.length ? `<span class="label" style="margin-left:6px">${escHtml(t.labels[0])}</span>` : ''}
        </div>
      </div>
      <div class="task-due ${overdue ? 'overdue' : ''}">${t.due ? formatDate(t.due) : '—'}${overdue ? ' ⚠' : ''}</div>
    </div>`;
  }).join('');
}

function renderActivity() {
  const el = document.getElementById('activity-feed');
  if (!State.activity.length) {
    el.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-3);font-size:.85rem">No activity yet</div>`;
    return;
  }
  el.innerHTML = State.activity.slice(0, 8).map(a => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${a.color}"></div>
      <div>
        <div class="activity-text">${escHtml(a.text)}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`).join('');
}

function toggleTaskDone(id) {
  const task = State.tasks.find(t => t.id === id);
  if (!task) return;
  task.status = task.status === 'done' ? 'todo' : 'done';
  addActivity(task.status === 'done' ? `Task "${task.title}" marked as Done` : `Task "${task.title}" reopened`,
    task.status === 'done' ? '#10b981' : '#f59e0b');
  persist(); renderAll();
}

/* ============================================================
   6. PROJECTS
   ============================================================ */

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  document.getElementById('proj-count').textContent    = State.projects.length;
  document.getElementById('proj-subtitle').textContent = `${State.projects.length} project${State.projects.length !== 1 ? 's' : ''} in your workspace`;

  const cards = State.projects.map(p => {
    const projTasks = State.tasks.filter(t => t.project === p.id);
    const done      = projTasks.filter(t => t.status === 'done').length;
    const pct       = projTasks.length ? Math.round(done / projTasks.length * 100) : 0;
    return `
    <div class="project-card">
      <div class="project-card-header">
        <div class="project-icon" style="background:${p.color}20;">${p.icon}</div>
        <div class="project-actions">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="editProject('${p.id}')" title="Edit">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProject('${p.id}')" title="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>
      <div class="project-name">${escHtml(p.name)}</div>
      <div class="project-desc">${escHtml(p.desc || '')}</div>
      <div class="project-footer">
        <span class="project-tasks">${projTasks.length} task${projTasks.length !== 1 ? 's' : ''}</span>
        <span class="status ${pct === 100 ? 'done' : pct > 0 ? 'in-progress' : 'todo'}">${pct === 100 ? 'Complete' : pct > 0 ? 'Active' : 'Not started'}</span>
      </div>
      <div class="project-progress-wrap">
        <div class="project-progress-label"><span>Progress</span><span>${pct}%</span></div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg,${p.color},${p.color}aa)"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  grid.innerHTML = cards + `
    <div class="add-project-card" onclick="openProjectModal()" role="button" tabindex="0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <span>Create New Project</span>
    </div>`;
}

function editProject(id) {
  event.stopPropagation();
  const p = State.projects.find(p => p.id === id);
  if (!p) return;
  document.getElementById('proj-edit-id').value = id;
  document.getElementById('proj-name').value    = p.name;
  document.getElementById('proj-desc').value    = p.desc || '';
  document.getElementById('proj-color').value   = p.color;
  document.getElementById('proj-icon').value    = p.icon;
  document.getElementById('proj-modal-title').textContent = 'Edit Project';
  document.getElementById('projectModal').classList.add('open');
}

function deleteProject(id) {
  event.stopPropagation();
  if (!confirm('Delete this project? Tasks will be unassigned but not deleted.')) return;
  const p = State.projects.find(p => p.id === id);
  State.projects = State.projects.filter(p => p.id !== id);
  State.tasks.forEach(t => { if (t.project === id) t.project = ''; });
  addActivity(`Project "${p?.name}" deleted`, '#f43f5e');
  persist(); renderAll();
  showToast('Project deleted', 'error');
}

/* ============================================================
   7. KANBAN BOARD + DRAG & DROP
   ============================================================ */

let draggingId = null;

function renderKanban() {
  ['todo', 'in-progress', 'done'].forEach(status => {
    const cards = State.tasks.filter(t => t.status === status);
    const el    = document.getElementById(`cards-${status}`);
    const cntEl = document.getElementById(`count-${status}`);
    if (cntEl) cntEl.textContent = cards.length;
    if (el)    el.innerHTML = cards.map(buildKanbanCard).join('');
  });
  document.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend',   dragEnd);
  });
}

function buildKanbanCard(t) {
  const today  = new Date().toISOString().split('T')[0];
  const ov     = t.status !== 'done' && t.due && t.due < today;
  const labels = (t.labels || []).map(l => `<span class="label">${escHtml(l)}</span>`).join('');
  return `
  <div class="kanban-card" id="kcard-${t.id}" draggable="true" data-id="${t.id}">
    <div class="kanban-card-top">
      ${priorityBadge(t.priority)}
      <div class="kanban-card-actions">
        <button class="card-action-btn" onclick="editTask('${t.id}')" title="Edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="card-action-btn delete" onclick="deleteTask('${t.id}')" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    </div>
    <div class="kanban-card-title">${escHtml(t.title)}</div>
    ${t.desc ? `<div class="kanban-card-desc">${escHtml(t.desc.length > 80 ? t.desc.slice(0,80)+'…' : t.desc)}</div>` : ''}
    ${labels ? `<div class="kanban-card-labels">${labels}</div>` : ''}
    <div class="kanban-card-footer">
      <span class="kanban-card-due ${ov ? 'overdue' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ${t.due ? formatDate(t.due) : 'No due date'}${ov ? ' ⚠' : ''}
      </span>
    </div>
  </div>`;
}

function dragStart(e) {
  draggingId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggingId);
}
function dragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));
}
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}
function dragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.classList.remove('drag-over');
}
function drop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const newStatus = e.currentTarget.dataset.status;
  if (!draggingId || !newStatus) return;
  const task = State.tasks.find(t => t.id === draggingId);
  if (!task || task.status === newStatus) return;
  const oldStatus = task.status;
  task.status     = newStatus;
  const labelMap  = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
  addActivity(`"${task.title}" moved from ${labelMap[oldStatus]} → ${labelMap[newStatus]}`,
    newStatus === 'done' ? '#10b981' : '#f59e0b');
  persist(); renderAll();
  showToast(`Task moved to ${labelMap[newStatus]}`, 'info');
}

/* ============================================================
   8. ANALYTICS
   ============================================================ */

let doughnutChart, barChart, lineChart;

function renderAnalytics() {
  renderPriorityBreakdown();
  renderProjectAnalytics();
  if (typeof Chart === 'undefined') { setTimeout(renderAnalytics, 500); return; }
  if (chartsInitialized) { updateCharts(); return; }

  const isDark  = document.documentElement.dataset.theme === 'dark';
  const textClr = isDark ? '#94a3b8' : '#64748b';
  const gridClr = isDark ? '#2d3748' : '#e2e8f0';
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.color       = textClr;

  const chartOpts = (type) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textClr, boxWidth: 12, padding: 16 } } },
    scales: type !== 'doughnut' ? {
      x: { grid: { color: gridClr }, ticks: { color: textClr } },
      y: { grid: { color: gridClr }, ticks: { color: textClr } },
    } : {},
  });

  const todo   = State.tasks.filter(t => t.status === 'todo').length;
  const inProg = State.tasks.filter(t => t.status === 'in-progress').length;
  const done   = State.tasks.filter(t => t.status === 'done').length;

  doughnutChart = new Chart(document.getElementById('chart-doughnut').getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['To Do', 'In Progress', 'Done'],
            datasets: [{ data: [todo, inProg, done], backgroundColor: ['#94a3b8','#f59e0b','#10b981'], borderWidth: 0, hoverOffset: 6 }] },
    options: { ...chartOpts('doughnut'), cutout: '68%' },
  });

  barChart = new Chart(document.getElementById('chart-bar').getContext('2d'), {
    type: 'bar',
    data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [{ label: 'Tasks Completed', data: [2,5,3,7,4,1,done], backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6, borderSkipped: false }] },
    options: { ...chartOpts('bar'), plugins: { legend: { display: false } } },
  });

  lineChart = new Chart(document.getElementById('chart-line').getContext('2d'), {
    type: 'line',
    data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'],
            datasets: [{ label: 'Tasks Done', data: [3,7,5,12,9,done+3], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#a855f7', pointRadius: 4 }] },
    options: chartOpts('line'),
  });

  chartsInitialized = true;
}

function updateCharts() {
  if (!chartsInitialized) return;
  const todo   = State.tasks.filter(t => t.status === 'todo').length;
  const inProg = State.tasks.filter(t => t.status === 'in-progress').length;
  const done   = State.tasks.filter(t => t.status === 'done').length;
  if (doughnutChart) { doughnutChart.data.datasets[0].data = [todo, inProg, done]; doughnutChart.update(); }
}

function renderPriorityBreakdown() {
  const el    = document.getElementById('priority-breakdown');
  const total = State.tasks.length || 1;
  const counts = { high: 0, medium: 0, low: 0 };
  State.tasks.forEach(t => { counts[t.priority] = (counts[t.priority] || 0) + 1; });
  const colors = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };
  el.innerHTML = Object.entries(counts).map(([p, n]) => {
    const pct = Math.round(n / total * 100);
    return `
    <div class="analytics-stat">
      <div class="analytics-stat-header">
        <span class="analytics-stat-label">${p.charAt(0).toUpperCase()+p.slice(1)} Priority</span>
        <span class="analytics-stat-val">${n} tasks (${pct}%)</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${colors[p]}"></div></div>
    </div>`;
  }).join('');
}

function renderProjectAnalytics() {
  const el = document.getElementById('project-analytics');
  el.innerHTML = State.projects.map(p => {
    const tasks = State.tasks.filter(t => t.project === p.id);
    const done  = tasks.filter(t => t.status === 'done').length;
    const pct   = tasks.length ? Math.round(done / tasks.length * 100) : 0;
    return `
    <div class="analytics-stat">
      <div class="analytics-stat-header">
        <span class="analytics-stat-label">${p.icon} ${escHtml(p.name)}</span>
        <span class="analytics-stat-val">${pct}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${p.color}"></div></div>
    </div>`;
  }).join('') || `<div style="color:var(--text-3);font-size:.85rem">No projects yet</div>`;
}

/* ============================================================
   9. SETTINGS
   ============================================================ */

function initSettings() {
  document.querySelectorAll('.settings-nav-item[data-panel]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-item').forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      document.getElementById(`panel-${el.dataset.panel}`).classList.add('active');
    });
  });
}

function savePreference(key, val) {
  const prefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFS) || '{}');
  prefs[key] = val;
  localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
}

function exportData() {
  const data = { tasks: State.tasks, projects: State.projects, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `taskforge-export-${Date.now()}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('Data exported successfully', 'success');
}

function clearAllData() {
  if (!confirm('This will delete ALL tasks, projects, and activity. Cannot be undone. Continue?')) return;
  State.tasks = []; State.projects = []; State.activity = [];
  persist(); chartsInitialized = false; renderAll();
  showToast('All data cleared', 'info');
}

/* ============================================================
   10. MODALS (TASK / PROJECT)
   ============================================================ */

function openModal(defaultStatus = 'todo') {
  clearTaskForm();
  document.getElementById('task-status').value          = defaultStatus;
  document.getElementById('modal-title-text').textContent = 'New Task';
  populateProjectSelect();
  document.getElementById('taskModal').classList.add('open');
  document.getElementById('task-title').focus();
}
function closeModal() { document.getElementById('taskModal').classList.remove('open'); }

function clearTaskForm() {
  ['task-edit-id','task-title','task-desc','task-labels'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('task-status').value   = 'todo';
  document.getElementById('task-priority').value = 'medium';
  document.getElementById('task-due').value      = '';
  document.getElementById('task-project').value  = '';
}

function populateProjectSelect() {
  const sel = document.getElementById('task-project');
  sel.innerHTML = '<option value="">— None —</option>' +
    State.projects.map(p => `<option value="${p.id}">${escHtml(p.name)}</option>`).join('');
}

function saveTask() {
  const title = document.getElementById('task-title').value.trim();
  if (!title) { showToast('Task title is required', 'error'); return; }
  const editId = document.getElementById('task-edit-id').value;
  const labels = document.getElementById('task-labels').value.split(',').map(s => s.trim()).filter(Boolean);
  const taskData = {
    title,
    desc:     document.getElementById('task-desc').value.trim(),
    status:   document.getElementById('task-status').value,
    priority: document.getElementById('task-priority').value,
    due:      document.getElementById('task-due').value,
    project:  document.getElementById('task-project').value,
    labels,
  };
  if (editId) {
    const idx = State.tasks.findIndex(t => t.id === editId);
    if (idx !== -1) { State.tasks[idx] = { ...State.tasks[idx], ...taskData }; }
    addActivity(`Task "${title}" updated`, '#6366f1');
    showToast('Task updated', 'success');
  } else {
    State.tasks.unshift({ id: uid(), ...taskData, createdAt: Date.now() });
    addActivity(`New task "${title}" created`, '#6366f1');
    showToast('Task created!', 'success');
  }
  persist(); closeModal(); renderAll();
}

function editTask(id) {
  const t = State.tasks.find(t => t.id === id);
  if (!t) return;
  populateProjectSelect();
  document.getElementById('task-edit-id').value  = t.id;
  document.getElementById('task-title').value    = t.title;
  document.getElementById('task-desc').value     = t.desc || '';
  document.getElementById('task-status').value   = t.status;
  document.getElementById('task-priority').value = t.priority;
  document.getElementById('task-due').value      = t.due || '';
  document.getElementById('task-project').value  = t.project || '';
  document.getElementById('task-labels').value   = (t.labels || []).join(', ');
  document.getElementById('modal-title-text').textContent = 'Edit Task';
  document.getElementById('taskModal').classList.add('open');
}

function deleteTask(id) {
  if (!confirm('Delete this task permanently?')) return;
  const t = State.tasks.find(t => t.id === id);
  State.tasks = State.tasks.filter(t => t.id !== id);
  addActivity(`Task "${t?.title}" deleted`, '#f43f5e');
  persist(); renderAll();
  showToast('Task deleted', 'error');
}

function openProjectModal() {
  document.getElementById('proj-edit-id').value = '';
  document.getElementById('proj-name').value    = '';
  document.getElementById('proj-desc').value    = '';
  document.getElementById('proj-color').value   = '#6366f1';
  document.getElementById('proj-icon').value    = '🚀';
  document.getElementById('proj-modal-title').textContent = 'New Project';
  document.getElementById('projectModal').classList.add('open');
  document.getElementById('proj-name').focus();
}
function closeProjectModal() { document.getElementById('projectModal').classList.remove('open'); }

function saveProject() {
  const name = document.getElementById('proj-name').value.trim();
  if (!name) { showToast('Project name is required', 'error'); return; }
  const editId   = document.getElementById('proj-edit-id').value;
  const projData = {
    name,
    desc:  document.getElementById('proj-desc').value.trim(),
    color: document.getElementById('proj-color').value,
    icon:  document.getElementById('proj-icon').value,
  };
  if (editId) {
    const idx = State.projects.findIndex(p => p.id === editId);
    if (idx !== -1) State.projects[idx] = { ...State.projects[idx], ...projData };
    addActivity(`Project "${name}" updated`, '#6366f1');
    showToast('Project updated', 'success');
  } else {
    State.projects.unshift({ id: uid(), ...projData, createdAt: Date.now() });
    addActivity(`New project "${name}" created`, '#a855f7');
    showToast('Project created!', 'success');
  }
  persist(); closeProjectModal(); renderAll();
}

document.addEventListener('click', e => {
  if (e.target.id === 'taskModal')    closeModal();
  if (e.target.id === 'projectModal') closeProjectModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeProjectModal(); }
});

/* ============================================================
   11. TOAST NOTIFICATIONS
   ============================================================ */

function showToast(message, type = 'info') {
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.info}<span>${escHtml(message)}</span>`;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity .3s ease, transform .3s ease';
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateY(8px)';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

/* ============================================================
   12. HEALTH ROUTE
   ============================================================ */

function openHealth() {
  document.getElementById('health-ts').textContent = `"${new Date().toISOString()}"`;
  document.getElementById('health-overlay').classList.add('active');
  history.pushState({}, '', '#/health');
}
function closeHealth() {
  document.getElementById('health-overlay').classList.remove('active');
  history.pushState({}, '', '#/dashboard');
}
window.addEventListener('popstate', () => {
  if (!location.hash.includes('/health'))
    document.getElementById('health-overlay').classList.remove('active');
});

/* ============================================================
   13. UTILITIES
   ============================================================ */

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function priorityBadge(priority) {
  const labels = { high: '↑ High', medium: '→ Medium', low: '↓ Low' };
  return `<span class="priority ${priority}">${labels[priority] || priority}</span>`;
}

function addActivity(text, color = '#6366f1') {
  State.activity.unshift({ text, time: 'just now', color });
  if (State.activity.length > 20) State.activity.length = 20;
}

function initSearch() {
  document.getElementById('globalSearch').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    if (!q) { renderAll(); return; }
    document.querySelectorAll('.kanban-card').forEach(card => {
      const title = card.querySelector('.kanban-card-title')?.textContent.toLowerCase() || '';
      card.style.display = title.includes(q) ? '' : 'none';
    });
    document.querySelectorAll('.task-row').forEach(row => {
      const title = row.querySelector('.task-title')?.textContent.toLowerCase() || '';
      row.style.display = title.includes(q) ? '' : 'none';
    });
  });
}

function toggleSidebar() {
  const sb   = document.getElementById('sidebar');
  const ov   = document.getElementById('sidebarOverlay');
  const open = sb.classList.toggle('open');
  ov.style.display = open ? 'block' : 'none';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').style.display = 'none';
}

function renderAll() {
  renderDashboard();
  renderProjects();
  renderKanban();
  if (currentPage === 'analytics') { chartsInitialized = false; renderAnalytics(); }
}

/* ============================================================
   14. INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  hydrate();
  initTheme();
  initNavigation();
  initSettings();
  initSearch();
  loadSampleData();
  renderAll();
  document.getElementById('notifBtn')?.addEventListener('click', () => {
    showToast('You have 3 overdue tasks!', 'error');
  });
  console.log('%cTaskForge v1.0 — Loaded', 'color:#6366f1;font-weight:700;font-size:14px');
  console.log('%cBuilt by Francis Egenti | DevOps Engineer', 'color:#94a3b8;font-size:12px');
});