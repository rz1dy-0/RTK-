import { getStudents } from './storage.js';
import { escapeHtml, getReadingInfo, today } from './utils.js';
export function renderDashboard() {
  const students = getStudents();
  document.getElementById('stat-total-num').textContent = students.length;
  document.getElementById('stat-iqra-num').textContent = students.filter(s => s.kategori === 'Iqra').length;
  document.getElementById('stat-alquran-num').textContent = students.filter(s => s.kategori === 'Al-Quran').length;
  document.getElementById('stat-tamayyuz-num').textContent = students.filter(s => s.kategori === 'Tamayyuz').length;
  document.getElementById('stat-khatam-num').textContent = students.filter(s => s.kategori === 'Khatam').length;
  const quranStudents = students.filter(s => s.kategori === 'Al-Quran');
  const avg = quranStudents.length ? quranStudents.reduce((a, s) => a + ((Number(s.page) || 0) / 604 * 100), 0) / quranStudents.length : 0;
  const pct = Math.min(100, avg).toFixed(1);
  document.getElementById('overall-progress').style.width = pct + '%';
  document.getElementById('progress-text').textContent = pct + '% purata bacaan Al-Quran';
  const sorted = [...students].sort((a, b) => ((Number(b.level)||0) * 1000 + (Number(b.page)||0)) - ((Number(a.level)||0) * 1000 + (Number(a.page)||0))).slice(0, 5);
  document.getElementById('top-list').innerHTML = sorted.length ? sorted.map((s, i) => `<div class="flex justify-between items-center py-2 border-b dark:border-slate-700 last:border-0"><span><b>${i + 1}.</b> ${escapeHtml(s.nama)}</span><span class="text-sm text-gray-500">${escapeHtml(getReadingInfo(s))}</span></div>`).join('') : '<p class="text-sm text-gray-500">Belum ada rekod murid.</p>';
  const todayCount = students.filter(s => s.tarikh === today()).length;
  document.getElementById('today-summary').innerHTML = `<p><b>${todayCount}</b> rekod dikemaskini hari ini.</p><p><b>${students.length - todayCount}</b> rekod bukan kemaskini hari ini.</p>`;
}
