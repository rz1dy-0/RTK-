import { renderDashboard } from './dashboard.js';
import { renderAnalysis } from './analysis.js';
import { renderTable, bindStudentEvents } from './student.js';
import { bindExcelEvents } from './excel.js';
export function renderAll() { renderDashboard(); renderTable(); renderAnalysis(); }
function showTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('tab-active', btn.dataset.tab === tabName));
  document.querySelectorAll('.tab-content').forEach(section => section.classList.toggle('hidden', section.id !== 'tab-' + tabName));
  localStorage.setItem('khatam_active_tab', tabName);
  renderAll();
}
function init() {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => showTab(btn.dataset.tab)));
  document.getElementById('dark-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('khatam_dark', document.documentElement.classList.contains('dark'));
  });
  if (localStorage.getItem('khatam_dark') === 'true') document.documentElement.classList.add('dark');
  bindStudentEvents();
  bindExcelEvents();
  showTab(localStorage.getItem('khatam_active_tab') || 'dashboard');
  if (window.lucide) lucide.createIcons();
}
init();
