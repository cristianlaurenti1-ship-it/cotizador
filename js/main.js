const PRECIO_LLAVE_EN_MANO = 840000;
const PRECIO_SEMILLAVE_EN_MANO = 550000;

let SERVICIOS = [];

const form = document.getElementById('formCotizacion');
const serviciosContainer = document.getElementById('serviciosContainer');
const resultadoSection = document.getElementById('resultado');
const outMetros = document.getElementById('outMetros');
const outTipo = document.getElementById('outTipo');
const outServicios = document.getElementById('outServicios');
const outTotal = document.getElementById('outTotal');
const listaHistorial = document.getElementById('listaHistorial');
const filterTipo = document.getElementById('filterTipo');
const btnBorrarHistorial = document.getElementById('btnBorrarHistorial');
const btnLimpiar = document.getElementById('btnLimpiar');

function getStatusElement() {
    let status = document.getElementById('statusMessage');
    if (!status) {
        status = document.createElement('div');
        status.id = 'statusMessage';
        status.className = 'card';
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(status, container.firstChild);
    }
    return status;
}

function showStatus(message, timeoutMs = 3000) {
        if (window.Toastify) {
        Toastify({ text: message, duration: timeoutMs, gravity: 'top', position: 'right', close: true }).showToast();
        return;
    }
    const status = getStatusElement();
    status.textContent = message;
    if (timeoutMs) {
        setTimeout(() => { status.textContent = ''; }, timeoutMs);
    }
}

function cargarHistorial() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}
function guardarHistorial(hist) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
}

async function renderServicios() {
    if (!serviciosContainer) return;
    
    if (!SERVICIOS || SERVICIOS.length === 0) {
        try {
            const res = await fetch('./data/services.json');
            if (!res.ok) throw new Error('No se pudo cargar services.json');
            SERVICIOS = await res.json();
        } catch (err) {
            showStatus('Error cargando servicios: ' + err.message, 5000);
            return;
        }
    }
    serviciosContainer.innerHTML = '';
    SERVICIOS.forEach(s => {
        const div = document.createElement('div');
        div.className = 'servicio-item';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = s.id;
        input.value = s.id;
        const label = document.createElement('label');
        label.htmlFor = s.id;
        label.textContent = `${s.name} (+ $${s.price.toLocaleString()})`;
        div.appendChild(input);
        div.appendChild(label);
        serviciosContainer.appendChild(div);
    });
}

function solicitarDatosUsuario() {
    if (!form) return null;
    const metros = Number(document.getElementById('metros').value);
    const tipoInput = document.querySelector('input[name="tipo"]:checked');
    const tipo = tipoInput ? tipoInput.value : null;

    const seleccionados = [];
    SERVICIOS.forEach(s => {
        const cb = document.getElementById(s.id);
        if (cb && cb.checked) seleccionados.push(s);
    });

    return { metros, tipo, servicios: seleccionados };
}

function calcularPresupuesto(datos) {
    const precioMetro = datos.tipo === 'Llave en mano' ? PRECIO_LLAVE_EN_MANO : PRECIO_SEMILLAVE_EN_MANO;
    const base = datos.metros * precioMetro;
    const serviciosTotal = datos.servicios.reduce((acc, s) => acc + s.price, 0);
    const total = base + serviciosTotal;
    return { base, serviciosTotal, total };
}

function mostrarResultado(datos, calculo) {
    if (!resultadoSection) return;
    outMetros.textContent = datos.metros + ' m²';
    outTipo.textContent = datos.tipo;
    outServicios.innerHTML = '';
    if (datos.servicios.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Ninguno';
        outServicios.appendChild(li);
    } else {
        datos.servicios.forEach(s => {
            const li = document.createElement('li');
            li.textContent = `${s.name} (+ $${s.price.toLocaleString()})`;
            outServicios.appendChild(li);
        });
    }
    outTotal.textContent = calculo.total.toLocaleString();
    resultadoSection.classList.remove('hidden');

    const historial = cargarHistorial();
    historial.push({ id: Date.now(), fecha: new Date().toLocaleString(), metros: datos.metros, tipo: datos.tipo, servicios: datos.servicios.map(s => s.name), total: calculo.total });
    guardarHistorial(historial);
    renderHistorial();
    showStatus('Cotización calculada correctamente', 3000);
}

function renderHistorial() {
    if (!listaHistorial) return;
    const all = cargarHistorial();
    const filtro = filterTipo ? filterTipo.value : 'all';
    const items = filtro === 'all' ? all : all.filter(i => i.tipo === filtro);
    listaHistorial.innerHTML = '';
    if (items.length === 0) {
        listaHistorial.innerHTML = '<li>No hay cotizaciones guardadas</li>';
        return;
    }
    items.forEach(item => {
        const li = document.createElement('li');
        let serviciosHtml = '';
        if (item.servicios && item.servicios.length > 0) {
            serviciosHtml = '<ul class="hist-servicios">';
            item.servicios.forEach(s => {
                serviciosHtml += `<li>${s}</li>`;
            });
            serviciosHtml += '</ul>';
        } else {
            serviciosHtml = '<em>Sin servicios</em>';
        }

        li.innerHTML = `<strong>${item.tipo}</strong> — ${item.metros} m² — $${item.total.toLocaleString()} <br><small>${item.fecha}</small><br>Servicios:${serviciosHtml}`;
        listaHistorial.appendChild(li);
    });
}

function limpiarFormulario() {
    if (!form) return;
    form.reset();
    if (resultadoSection) resultadoSection.classList.add('hidden');
    showStatus('Formulario limpiado', 2000);
}

function borrarHistorial() {
    borrarHistorialStorage();
    renderHistorial();
    showStatus('Historial borrado', 2000);
}

function iniciarSimulador() {
    renderServicios();
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const datos = solicitarDatosUsuario();
            if (!datos) return;
            if (!datos.metros || datos.metros <= 0) {
                showStatus('Ingrese metros válidos (mayor a 0)', 3000);
                return;
            }
            if (!datos.tipo) {
                showStatus('Seleccione un tipo de construcción', 3000);
                return;
            }
            const calculo = calcularPresupuesto(datos);
            mostrarResultado(datos, calculo);
        });
    }
    if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFormulario);
    if (filterTipo) filterTipo.addEventListener('change', renderHistorial);
    if (btnBorrarHistorial) btnBorrarHistorial.addEventListener('click', borrarHistorial);
    renderHistorial();
}

document.addEventListener('DOMContentLoaded', iniciarSimulador);
