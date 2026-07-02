import { getStudents, replaceStudents, clearStudents } from './storage.js';
import { showMessage, uid, today } from './utils.js';
import { renderAll } from './app.js';
export function bindExcelEvents() {
  document.getElementById('export-excel-btn').addEventListener('click', exportExcel);
  document.getElementById('export-json-btn').addEventListener('click', exportJson);
  document.getElementById('import-excel-input').addEventListener('change', importExcel);
  document.getElementById('clear-data-btn').addEventListener('click', () => {
    if (!window.confirm('Padam semua data dalam browser ini?')) return;
    clearStudents(); renderAll(); showMessage('data-msg', 'Semua data telah dipadam.');
  });
}
function exportExcel() {
  const rows = getStudents().map(s => ({ nama: s.nama, tahun: s.tahun, kelas: s.kelas, kategori: s.kategori, tarikh: s.tarikh, level: s.level, page: s.page, tam_status: s.tam_status, tam_surah: s.tam_surah, tam_ayat: s.tam_ayat, mentee: s.mentee, catatan: s.catatan }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Rekod Murid');
  XLSX.writeFile(wb, `road-to-khatam-${today()}.xlsx`);
}
function exportJson() {
  const blob = new Blob([JSON.stringify(getStudents(), null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `road-to-khatam-backup-${today()}.json`;
  a.click();
}
async function importExcel(e) {
  const file = e.target.files[0];
  if (!file) return;
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);
  const records = rows.map(r => ({
    id: uid(),
    nama: r.nama || r.Nama || r.name || '',
    tahun: r.tahun || r.Tahun || 'Tahun 1',
    kelas: r.kelas || r.Kelas || 'Neuron',
    kategori: r.kategori || r.Kategori || 'Iqra',
    tarikh: r.tarikh || r.Tarikh || today(),
    level: r.level || r.Level || r.juzuk || r.Juzuk || r.iqra || r.Iqra || '',
    page: r.page || r.Page || r.muka_surat || r['muka surat'] || r.ms || '',
    tam_status: r.tam_status || '', tam_surah: r.tam_surah || '', tam_ayat: r.tam_ayat || '', mentee: r.mentee || '', catatan: r.catatan || r.Catatan || ''
  })).filter(r => r.nama);
  replaceStudents([...getStudents(), ...records]);
  renderAll();
  showMessage('data-msg', `✓ ${records.length} rekod berjaya diimport.`);
  e.target.value = '';
}
