# Pruebas API con Karate

Este proyecto contiene pruebas de API para GoRest. Requiere Java 17 o superior, Maven y un token activo de GoRest.

## Ejecutar localmente

Define el token fuera del repositorio y ejecuta las pruebas desde esta carpeta:

```sh
export GOREST_TOKEN='tu-token-de-gorest'
mvn test
```

Opcionalmente, puedes cambiar la URL base:

```sh
export GOREST_BASE_URL='https://gorest.co.in/public/v2'
```

Los resultados se generan en `target/karate-reports/` y los reportes de Maven en `target/surefire-reports/`. Ambos directorios se excluyen del repositorio.

No subas tokens ni reportes: los escenarios crean, actualizan y eliminan datos de prueba en GoRest.
