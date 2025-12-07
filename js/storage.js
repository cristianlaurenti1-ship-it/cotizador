
const STORAGE_KEY = 'simulador_presupuestos';

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

function cargarHistorial() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function guardarHistorial(hist) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
}

function borrarHistorialStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
