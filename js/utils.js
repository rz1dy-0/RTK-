export const today = () => new Date().toISOString().slice(0, 10);
export const uid = () => String(Date.now()) + Math.random().toString(16).slice(2);
export function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
export function showMessage(id, message, type = 'success') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `mt-3 text-sm ${type === 'error' ? 'text-red-600' : 'text-emerald-600'}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}
export function getReadingInfo(s) {
  if (s.kategori === 'Iqra') return `Iqra ${s.level || '-'} | M/S ${s.page || '-'}`;
  if (s.kategori === 'Al-Quran') return `Juzuk ${s.level || '-'} | M/S ${s.page || '-'}`;
  if (s.kategori === 'Tamayyuz') return `${s.tam_status || 'Sedang Hafal'} ${s.tam_surah ? '| ' + s.tam_surah : ''} ${s.tam_ayat ? '(' + s.tam_ayat + ')' : ''}`;
  if (s.kategori === 'Khatam') return 'Khatam ✓';
  if (s.kategori === 'Mentor') return `Mentor${s.mentee ? ' kepada ' + s.mentee : ''}`;
  return '-';
}
