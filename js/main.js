// Variables y constantes para los precios por metro cuadrado
const PRECIO_LLAVE_EN_MANO = 840000;
const PRECIO_SEMILLAVE_EN_MANO = 550000;

// Array de servicios incluidos en cada modalidad
const SERVICIOS = {
    "Llave en mano": [
        "Materiales completos",
        "Mano de obra",
        "Instalación eléctrica",
        "Instalación sanitaria",
        "Terminaciones"
    ],
    "Semillave en mano": [
        "Materiales básicos",
        "Mano de obra básica",
        "Instalación eléctrica básica"
    ]
};

// Array para guardar historial de presupuestos
let presupuestos = [];

// Función para solicitar datos al usuario
function solicitarDatosUsuario() {
    console.log("=== NUEVO PRESUPUESTO ===");
    
    // Solicitar metros cuadrados
    let metros = parseFloat(prompt("Ingrese la cantidad de metros cuadrados a construir:"));
    while (isNaN(metros) || metros <= 0) {
        alert("Por favor, ingrese un número válido mayor a 0");
        metros = parseFloat(prompt("Ingrese la cantidad de metros cuadrados a construir:"));
    }
    
    // Solicitar tipo de construcción
    let tipoConstruccion;
    let opcion;
    do {
        opcion = prompt("Seleccione el tipo de construcción:\n" + 
                       "1. Llave en mano ($" + PRECIO_LLAVE_EN_MANO + " por m²)\n" + 
                       "2. Semillave en mano ($" + PRECIO_SEMILLAVE_EN_MANO + " por m²)");
    } while (opcion !== "1" && opcion !== "2");
    
    tipoConstruccion = opcion === "1" ? "Llave en mano" : "Semillave en mano";
    
    return {metros, tipoConstruccion};
}

// Función para calcular el presupuesto
function calcularPresupuesto(metros, tipoConstruccion) {
    const precioPorMetro = tipoConstruccion === "Llave en mano" ? 
                          PRECIO_LLAVE_EN_MANO : 
                          PRECIO_SEMILLAVE_EN_MANO;
    
    const total = metros * precioPorMetro;
    
    // Guardar en el historial
    presupuestos.push(total);
    
    return total;
}

// Función para mostrar el resultado
function mostrarResultado(metros, tipoConstruccion, presupuesto) {
    console.log("\n=== RESULTADO DE LA COTIZACIÓN ===\n" + 
                "Metros cuadrados: " + metros + " m²\n" + 
                "Tipo de construcción: " + tipoConstruccion + "\n" + 
                "Servicios incluidos:");
    
    // Mostrar servicios incluidos
    console.log("\nServicios incluidos:");
    SERVICIOS[tipoConstruccion].forEach(servicio => {
        console.log("✓ " + servicio);
    });
    
    console.log("\nPresupuesto total: $" + presupuesto.toLocaleString() + "\n");
    
    // Mostrar el presupuesto en un alert
    alert("PRESUPUESTO FINAL:\n\n" + 
          "Metros cuadrados: " + metros + " m²\n" + 
          "Tipo: " + tipoConstruccion + "\n" + 
          "Total: $" + presupuesto.toLocaleString());
}

// Función principal que controla el flujo del simulador
function iniciarSimulador() {
    console.log("Bienvenido al Simulador de Cotización - Construcción en Seco");
    
    let continuar = true;
    while (continuar) {
        // Solicitar datos
        const datos = solicitarDatosUsuario();
        
        // Calcular presupuesto
        const presupuesto = calcularPresupuesto(datos.metros, datos.tipoConstruccion);
        
        // Mostrar resultado
        mostrarResultado(datos.metros, datos.tipoConstruccion, presupuesto);
        
        // Preguntar si desea realizar otra cotización
        continuar = confirm("¿Desea realizar otra cotización?");
    }
    
    // Mostrar historial de cotizaciones
    console.log("\n=== HISTORIAL DE COTIZACIONES ===");
    console.table(presupuestos);
    
    console.log("\n¡Gracias por utilizar nuestro simulador!");
}

// Iniciar el simulador cuando cargue la página
iniciarSimulador();
