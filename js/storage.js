const STORAGE_KEY = 'road_to_khatam_students';
let students = loadStudents();
function loadStudents() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); }
export function getStudents() { return students; }
export function addStudent(record) { students.push(record); persist(); }
export function updateStudent(id, patch) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) { students[index] = { ...students[index], ...patch }; persist(); }
}
export function deleteStudent(id) { students = students.filter(s => s.id !== id); persist(); }
export function replaceStudents(records) { students = records; persist(); }
export function clearStudents() { students = []; persist(); }
