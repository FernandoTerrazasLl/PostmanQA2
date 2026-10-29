# Automatización de la aplicación Reloj

Proyecto de pruebas móviles para `com.google.android.deskclock` con WebdriverIO, Appium, Cucumber y Page Object Model (POM).

## Requisitos

- Node.js 24, Java 21, Android SDK y la imagen ARM64 `android-37.1/google_apis_playstore_ps16k` para la ejecución local.
- El APK de Google Clock 7.5 (`com.google.android.deskclock`), por defecto en `~/Downloads/Clock.apk`. Puede cambiarse con `APPIUM_APP_PATH`.
- `npm ci` instala las versiones fijadas de WebdriverIO 9, Appium 3 y UiAutomator2.

## Ejecución

```bash
npm ci
npm run test:local
```

El comando local crea y arranca `Clock_CI` sin ventana, espera Android, ejecuta los ocho escenarios y cierra sus propios procesos. El AVD se conserva en `~/.jenkins/appium-ci/avd`, separado del emulador personal. Requiere los puertos 4723 y 5580 libres.

Ejecutar solamente el smoke del cronómetro:

```bash
APPIUM_SUITE=smoke npm run test:local
```

## BrowserStack

Define `BROWSERSTACK_USERNAME` y `BROWSERSTACK_ACCESS_KEY` en el entorno de la terminal sin guardarlas en archivos del repositorio. Sube el APK y ejecuta una sesión:

```bash
export BROWSERSTACK_APP_ID="$(node scripts/upload-app.cjs)"
APPIUM_TARGET=browserstack APPIUM_SUITE=smoke npm run test:browserstack
```

## Escenarios nuevos

1. Agregar una ciudad al reloj mundial.
2. Eliminar una ciudad del reloj mundial.
3. Iniciar y pausar el cronómetro.
4. Registrar una vuelta en el cronómetro.
5. Configurar, iniciar y pausar un temporizador de un minuto.

El destino remoto es Google Pixel 8 con Android 14. `APPIUM_SUITE=full` ejecuta los ocho escenarios en una sola sesión. Cada ejecución remota consume los minutos de App Automate de tu cuenta; no hay reintentos automáticos ni túnel local.

## Jenkins y reportes

En `Newman_Example`, selecciona **Build with Parameters** y elige `APPIUM_TARGET` (`local` o `browserstack`) y `APPIUM_SUITE` (`smoke` o `full`). El modo BrowserStack necesita una credencial **Username with password** con ID `browserstack-account`: Username es el usuario de automatización, Password es la Access Key. El Jenkinsfile enlaza esos valores temporalmente y sube el APK antes de la sesión. Si ya subiste el mismo APK desde el panel, puedes introducir el identificador devuelto en `BROWSERSTACK_APP_ID` para reutilizarlo sin volver a cargarlo.

Si BrowserStack rechaza la carga (por ejemplo HTTP 422), la build falla mostrando el mensaje de la plataforma y no inicia sesiones móviles. Puedes comprobar la carga desde App Management en BrowserStack; una ejecución local aprobada no se presenta como una ejecución remota aprobada.

JUnit se guarda en `reports/junit`, Allure en `reports/allure-results`, y las evidencias de fallo en `reports/screenshots` y `reports/logs`. Jenkins publica JUnit y un Allure combinado con las pruebas web, y archiva las evidencias antes de limpiar el workspace. Un fallo de Appium hace fallar la build.

El APK, credenciales, `node_modules`, AVD y reportes no se versionan. La ruta de APK, Java y Android SDK del Jenkinsfile corresponde a la Mac que ejecuta este job; al cambiar de agente hay que provisionar esos requisitos y ajustar las rutas.
