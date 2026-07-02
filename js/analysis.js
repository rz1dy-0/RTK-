import { getStudents } from './storage.js';
import { escapeHtml } from './utils.js';
export function renderAnalysis() {
  const cats = { 'Iqra': 0, 'Al-Quran': 0, 'Tamayyuz': 0, 'Khatam': 0, 'Mentor': 0 };
  getStudents().forEach(s => { if (cats[s.kategori] !== undefined) cats[s.kategori]++; });
  const maxC = Math.max(...Object.values(cats), 1);
  document.getElementById('kategori-chart').innerHTML = Object.entries(cats).map(([k, v]) => `<div class="flex items-center gap-2"><span class="text-xs w-20">${k}</span><div class="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-4"><div class="h-4 rounded-full bg-islamic-green" style="width:${v / maxC * 100}%"></div></div><span class="text-xs w-6">${v}</span></div>`).join('');
  const ranking = [...getStudents()].filter(s => s.kategori === 'Al-Quran').sort((a, b) => ((Number(b.level)||0) * 1000 + (Number(b.page)||0)) - ((Number(a.level)||0) * 1000 + (Number(a.page)||0))).slice(0, 10);
  document.getElementById('ranking-list').innerHTML = ranking.length ? ranking.map((s, i) => `<div class="flex justify-between py-2 border-b dark:border-slate-700"><span><b>${i+1}.</b> ${escapeHtml(s.nama)}</span><span class="text-islamic-green font-semibold">J${s.level || '-'} M/S${s.page || '-'}</span></div>`).join('') : '<p class="text-sm text-gray-500">Belum ada rekod Al-Quran.</p>';
}
