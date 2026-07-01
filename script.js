const STORAGE_KEY = 'road_to_khatam_students';
const today = new Date().toISOString().slice(0, 10);
let allStudents = loadStudents();

function loadStudents() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(allStudents)); }
function getStudents() { return allStudents; }
function getReadingInfo(s) {
  if (s.kategori === 'Iqra') return `Iqra ${s.level || '-'} | M/S ${s.page || '-'}`;
  if (s.kategori === 'Al-Quran') return `Juzuk ${s.level || '-'} | M/S ${s.page || '-'}`;
  if (s.kategori === 'Tamayyuz') return `${s.tam_status || 'Sedang Hafal'} ${s.tam_surah ? '| ' + s.tam_surah : ''} ${s.tam_ayat ? '(' + s.tam_ayat + ')' : ''}`;
  if (s.kategori === 'Khatam') return 'Khatam ✓';
  if (s.kategori === 'Mentor') return `Mentor${s.mentee ? ' kepada ' + s.mentee : ''}`;
  return '-';
}
function showTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('tab-active', btn.dataset.tab === tabName));
  document.querySelectorAll('.tab-content').forEach(section => section.classList.toggle('hidden', section.id !== 'tab-' + tabName));
  localStorage.setItem('khatam_active_tab', tabName);
  renderAll();
}
function toggleAddFields(val) {
  document.getElementById('fields-iqra').classList.toggle('hidden', val !== 'Iqra');
  document.getElementById('fields-quran').classList.toggle('hidden', val !== 'Al-Quran');
  document.getElementById('fields-tamayyuz').classList.toggle('hidden', val !== 'Tamayyuz');
  document.getElementById('fields-mentor').classList.toggle('hidden', val !== 'Mentor');
}
function renderDashboard() {
  const students = getStudents();
  document.getElementById('stat-total-num').textContent = students.length;
  document.getElementById('stat-iqra-num').textContent = students.filter(s => s.kategori === 'Iqra').length;
  document.getElementById('stat-alquran-num').textContent = students.filter(s => s.kategori === 'Al-Quran').length;
  document.getElementById('stat-tamayyuz-num').textContent = students.filter(s => s.kategori === 'Tamayyuz').length;
  const quranStudents = students.filter(s => s.kategori === 'Al-Quran');
  const avg = quranStudents.length ? quranStudents.reduce((a, s) => a + ((Number(s.page) || 0) / 604 * 100), 0) / quranStudents.length : 0;
  const pct = Math.min(100, avg).toFixed(1);
  document.getElementById('overall-progress').style.width = pct + '%';
  document.getElementById('progress-text').textContent = pct + '% purata bacaan Al-Quran';
  const sorted = [...students].sort((a, b) => ((Number(b.level)||0) * 1000 + (Number(b.page)||0)) - ((Number(a.level)||0) * 1000 + (Number(a.page)||0))).slice(0, 5);
  document.getElementById('top-list').innerHTML = sorted.length ? sorted.map((s, i) => `<div class="flex justify-between items-center py-2 border-b dark:border-slate-700 last:border-0"><span><b>${i + 1}.</b> ${escapeHtml(s.nama)}</span><span class="text-sm text-gray-500">${escapeHtml(getReadingInfo(s))}</span></div>`).join('') : '<p class="text-sm text-gray-500">Belum ada rekod murid.</p>';
}
function renderTable() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const tahun = document.getElementById('filter-tahun').value;
  const kelas = document.getElementById('filter-kelas').value;
  const kategori = document.getElementById('filter-kategori').value;
  const filtered = getStudents().filter(s => (!search || s.nama.toLowerCase().includes(search)) && (!tahun || s.tahun === tahun) && (!kelas || s.kelas === kelas) && (!kategori || s.kategori === kategori));
  document.getElementById('student-table').innerHTML = filtered.length ? filtered.map((s, i) => `<tr class="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"><td class="px-3 py-2">${i + 1}</td><td class="px-3 py-2 font-medium">${escapeHtml(s.nama)}</td><td class="px-3 py-2">${escapeHtml(s.tahun)}</td><td class="px-3 py-2">${escapeHtml(s.kelas)}</td><td class="px-3 py-2 text-xs">${escapeHtml(s.tarikh || '-')}</td><td class="px-3 py-2">${escapeHtml(s.kategori)}</td><td class="px-3 py-2 text-xs">${escapeHtml(getReadingInfo(s))}</td><td class="px-3 py-2 no-print"><button onclick="openEdit('${s.id}')" class="text-islamic-green hover:underline text-xs font-semibold">Edit</button></td></tr>`).join('') : '<tr><td colspan="8" class="px-3 py-6 text-center text-gray-500">Tiada rekod.</td></tr>';
}
function renderAnalysis() {
  const cats = { 'Iqra': 0, 'Al-Quran': 0, 'Tamayyuz': 0, 'Khatam': 0, 'Mentor': 0 };
  getStudents().forEach(s => { if (cats[s.kategori] !== undefined) cats[s.kategori]++; });
  const maxC = Math.max(...Object.values(cats), 1);
  document.getElementById('kategori-chart').innerHTML = Object.entries(cats).map(([k, v]) => `<div class="flex items-center gap-2"><span class="text-xs w-20">${k}</span><div class="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-4"><div class="h-4 rounded-full bg-islamic-green" style="width:${v / maxC * 100}%"></div></div><span class="text-xs w-6">${v}</span></div>`).join('');
  const ranking = [...getStudents()].filter(s => s.kategori === 'Al-Quran').sort((a, b) => ((Number(b.level)||0) * 1000 + (Number(b.page)||0)) - ((Number(a.level)||0) * 1000 + (Number(a.page)||0))).slice(0, 10);
  document.getElementById('ranking-list').innerHTML = ranking.length ? ranking.map((s, i) => `<div class="flex justify-between py-2 border-b dark:border-slate-700"><span><b>${i+1}.</b> ${escapeHtml(s.nama)}</span><span class="text-islamic-green font-semibold">J${s.level || '-'} M/S${s.page || '-'}</span></div>`).join('') : '<p class="text-sm text-gray-500">Belum ada rekod Al-Quran.</p>';
}
function renderAll() { renderDashboard(); renderTable(); renderAnalysis(); }
function escapeHtml(text) { return String(text ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => showTab(btn.dataset.tab)));
document.getElementById('f-kategori').addEventListener('change', e => toggleAddFields(e.target.value));
['search-input','filter-tahun','filter-kelas','filter-kategori'].forEach(id => document.getElementById(id).addEventListener('input', renderTable));

document.getElementById('add-form').addEventListener('submit', e => {
  e.preventDefault();
  const kategori = document.getElementById('f-kategori').value;
  const record = {
    id: String(Date.now()), nama: document.getElementById('f-nama').value.trim(), tahun: document.getElementById('f-tahun').value, kelas: document.getElementById('f-kelas').value, kategori, tarikh: today,
    level: kategori === 'Iqra' ? document.getElementById('f-iqra-num').value : kategori === 'Al-Quran' ? document.getElementById('f-juzuk').value : '',
    page: kategori === 'Iqra' ? document.getElementById('f-iqra-ms').value : kategori === 'Al-Quran' ? document.getElementById('f-ms').value : '',
    tam_status: document.getElementById('f-tam-status').value, tam_surah: document.getElementById('f-tam-surah').value, tam_ayat: document.getElementById('f-tam-ayat').value,
    mentee: document.getElementById('f-mentee').value, catatan: document.getElementById('f-catatan').value
  };
  allStudents.push(record); persist(); e.target.reset(); toggleAddFields('Iqra'); renderAll();
  const msg = document.getElementById('form-msg'); msg.textContent = '✓ Murid berjaya ditambah!'; msg.classList.remove('hidden'); setTimeout(() => msg.classList.add('hidden'), 3000);
});

window.openEdit = function(id) {
  const s = allStudents.find(x => x.id === id); if (!s) return;
  document.getElementById('edit-id').value = s.id; document.getElementById('e-nama').value = s.nama; document.getElementById('e-tarikh').value = s.tarikh || today; document.getElementById('e-kategori').value = s.kategori; document.getElementById('e-level').value = s.level || ''; document.getElementById('e-page').value = s.page || ''; document.getElementById('e-catatan').value = s.catatan || '';
  document.getElementById('edit-modal').classList.remove('hidden');
}
document.getElementById('modal-close-btn').addEventListener('click', () => document.getElementById('edit-modal').classList.add('hidden'));
document.getElementById('edit-form').addEventListener('submit', e => {
  e.preventDefault(); const id = document.getElementById('edit-id').value; const s = allStudents.find(x => x.id === id); if (!s) return;
  s.nama = document.getElementById('e-nama').value; s.tarikh = document.getElementById('e-tarikh').value; s.kategori = document.getElementById('e-kategori').value; s.level = document.getElementById('e-level').value; s.page = document.getElementById('e-page').value; s.catatan = document.getElementById('e-catatan').value;
  persist(); document.getElementById('edit-modal').classList.add('hidden'); renderAll();
});
document.getElementById('modal-padam-btn').addEventListener('click', () => { const id = document.getElementById('edit-id').value; allStudents = allStudents.filter(s => s.id !== id); persist(); document.getElementById('edit-modal').classList.add('hidden'); renderAll(); });
document.getElementById('dark-toggle').addEventListener('click', () => { document.documentElement.classList.toggle('dark'); localStorage.setItem('khatam_dark', document.documentElement.classList.contains('dark')); });
document.getElementById('export-btn').addEventListener('click', () => { const blob = new Blob([JSON.stringify(allStudents, null, 2)], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data-road-to-khatam.json'; a.click(); });
if (localStorage.getItem('khatam_dark') === 'true') document.documentElement.classList.add('dark');
showTab(localStorage.getItem('khatam_active_tab') || 'dashboard');
if (window.lucide) lucide.createIcons();
