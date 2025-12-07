ProyectoFinal+LaurentiCristian

Simulador interactivo de cotización para construcciones en seco

Estructura del proyecto

- index.html
- css/styles.css
- js/storage.js  -> helper para localStorage (inicializar, cargar, guardar, borrar)
- js/main.js     -> lógica principal (DOM, fetch, render, eventos)
- data/services.json -> datos simulados (servicios con precios)
- data/presupuestos.json -> (opcional) ejemplo de respaldo
- assets/        -> carpeta para imágenes y otros recursos

Instrucciones rápidas

1. Abrir `index.html` en el navegador.
2. El formulario carga los servicios desde `data/services.json` mediante fetch.
3. Ingrese los metros, seleccione tipo y servicios y haga clic en "Calcular".
4. El resultado se muestra en la página y la cotización se guarda en el historial (localStorage).




