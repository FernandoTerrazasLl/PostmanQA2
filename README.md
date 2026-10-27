# PostmanQA2: Newman y WebdriverIO

El repositorio conserva las pruebas de API existentes y agrega las pruebas de navegador de `webDriverPOM` en `webdriverio/`.

## Ejecutar WebdriverIO

Requisitos: Node.js 20 o superior, npm, Google Chrome e Internet para instalar dependencias, obtener el controlador y acceder a la página de pruebas.

```sh
cd webdriverio
npm ci
npm test
```

Se ejecutan dos casos con Chrome sin ventana: login válido y login inválido. WebdriverIO detecta Chrome y administra su controlador. Para una instalación especial puede indicarse `CHROME_BINARY` con la ruta al ejecutable.

Los resultados JUnit quedan en `webdriverio/reports/junit/`. Los fallos generan capturas en `webdriverio/reports/screenshots/`. Cada ejecución limpia estos reportes. `npm test` devuelve un código distinto de cero si falla una prueba o el navegador no puede iniciarse.

## Jenkins

Configurar `Newman_Example` como **Pipeline script from SCM**, Git, repositorio `https://github.com/FernandoTerrazasLl/PostmanQA2.git`, rama `*/main` y script `Jenkinsfile`.

La pipeline requiere un agente macOS con Node.js, npm, Chrome, Newman y `newman-reporter-html` instalados. Utiliza los plugins Pipeline, Git, JUnit y HTML Publisher.

Etapas: preparación (`npm ci`), Newman y WebdriverIO. Los errores de la etapa Newman no impiden ejecutar WebdriverIO. Los fallos de WebdriverIO hacen fallar el job; Jenkins publica sus resultados JUnit y archiva reportes y capturas.

La colección y el entorno Newman se mantienen intactos. También se conserva su comando existente, incluida la opción `-x` (`--suppress-exit-code`): el estado de Newman mantiene el comportamiento previo y sus detalles deben consultarse en el reporte HTML.
