import { addStudent, updateStudent, deleteStudent, getStudents } from './storage.js';
import { escapeHtml, getReadingInfo, showMessage, today, uid } from './utils.js';
import { renderAll } from './app.js';
export function bindStudentEvents() {
  document.getElementById('f-kategori').addEventListener('change', e => toggleFields(e.target.value));
  ['search-input','filter-tahun','filter-kelas','filter-kategori'].forEach(id => {
    document.getElementById(id).addEventListener('input', renderTable);
    document.getElementById(id).addEventListener('change', renderTable);
  });
  document.getElementById('add-form').addEventListener('submit', handleAdd);
  document.getElementById('modal-close-btn').addEventListener('click', closeEdit);
  document.getElementById('edit-form').addEventListener('submit', handleEdit);
  document.getElementById('modal-padam-btn').addEventListener('click', handleDelete);
  window.openEdit = openEdit;
}
function toggleFields(kategori) {
  document.getElementById('fields-level').classList.toggle('hidden', !['Iqra','Al-Quran'].includes(kategori));
  document.getElementById('fields-tamayyuz').classList.toggle('hidden', kategori !== 'Tamayyuz');
  document.getElementById('fields-mentor').classList.toggle('hidden', kategori !== 'Mentor');
  document.getElementById('level-label').textContent = kategori === 'Iqra' ? 'Iqra Berapa' : 'Juzuk';
}
function handleAdd(e) {
  e.preventDefault();
  const kategori = document.getElementById('f-kategori').value;
  const record = {
    id: uid(),
    nama: document.getElementById('f-nama').value.trim(),
    tahun: document.getElementById('f-tahun').value,
    kelas: document.getElementById('f-kelas').value,
    kategori,
    tarikh: today(),
    level: ['Iqra','Al-Quran'].includes(kategori) ? document.getElementById('f-level').value : '',
    page: ['Iqra','Al-Quran'].includes(kategori) ? document.getElementById('f-page').value : '',
    tam_status: kategori === 'Tamayyuz' ? document.getElementById('f-tam-status').value : '',
    tam_surah: kategori === 'Tamayyuz' ? document.getElementById('f-tam-surah').value : '',
    tam_ayat: kategori === 'Tamayyuz' ? document.getElementById('f-tam-ayat').value : '',
    mentee: kategori === 'Mentor' ? document.getElementById('f-mentee').value : '',
    catatan: document.getElementById('f-catatan').value
  };
  addStudent(record);
  e.target.reset();
  toggleFields('Iqra');
  renderAll();
  showMessage('form-msg', '✓ Murid berjaya ditambah dan disimpan!');
}
export function renderTable() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const tahun = document.getElementById('filter-tahun').value;
  const kelas = document.getElementById('filter-kelas').value;
  const kategori = document.getElementById('filter-kategori').value;
  const filtered = getStudents().filter(s => (!search || s.nama.toLowerCase().includes(search)) && (!tahun || s.tahun === tahun) && (!kelas || s.kelas === kelas) && (!kategori || s.kategori === kategori));
  document.getElementById('student-table').innerHTML = filtered.length ? filtered.map((s, i) => `<tr class="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"><td class="px-3 py-2">${i + 1}</td><td class="px-3 py-2 font-medium">${escapeHtml(s.nama)}</td><td class="px-3 py-2">${escapeHtml(s.tahun)}</td><td class="px-3 py-2">${escapeHtml(s.kelas)}</td><td class="px-3 py-2 text-xs">${escapeHtml(s.tarikh || '-')}</td><td class="px-3 py-2">${escapeHtml(s.kategori)}</td><td class="px-3 py-2 text-xs">${escapeHtml(getReadingInfo(s))}</td><td class="px-3 py-2 no-print"><button onclick="openEdit('${s.id}')" class="text-islamic-green hover:underline text-xs font-semibold">Edit</button></td></tr>`).join('') : '<tr><td colspan="8" class="px-3 py-6 text-center text-gray-500">Tiada rekod.</td></tr>';
}
function openEdit(id) {
  const s = getStudents().find(x => x.id === id); if (!s) return;
  document.getElementById('edit-id').value = s.id;
  document.getElementById('e-nama').value = s.nama;
  document.getElementById('e-tarikh').value = s.tarikh || today();
  document.getElementById('e-kategori').value = s.kategori;
  document.getElementById('e-level').value = s.level || '';
  document.getElementById('e-page').value = s.page || '';
  document.getElementById('e-catatan').value = s.catatan || '';
  document.getElementById('edit-modal').classList.remove('hidden');
}
function closeEdit() { document.getElementById('edit-modal').classList.add('hidden'); }
function handleEdit(e) {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  updateStudent(id, {
    nama: document.getElementById('e-nama').value.trim(),
    tarikh: document.getElementById('e-tarikh').value,
    kategori: document.getElementById('e-kategori').value,
    level: document.getElementById('e-level').value,
    page: document.getElementById('e-page').value,
    catatan: document.getElementById('e-catatan').value
  });
  closeEdit();
  renderAll();
}
function handleDelete() {
  const id = document.getElementById('edit-id').value;
  deleteStudent(id);
  closeEdit();
  renderAll();
}
