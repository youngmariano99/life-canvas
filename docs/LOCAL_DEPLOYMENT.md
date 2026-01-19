# Guía de Despliegue Local Optimizado
# Life Canvas - Personal Production Mode

Este documento describe el procedimiento para unificar el Frontend y Backend del proyecto en una sola aplicación ejecutable, optimizada para uso personal en PC (Windows), minimizando el consumo de recursos y ocultando las consolas de ejecución.

## Objetivo
Transformar el entorno de desarrollo (2 servidores: Vite + NestJS) en un entorno de producción local (1 servidor: NestJS sirviendo estáticos) que se ejecute en segundo plano.

## Estrategia Técnica
1.  **Frontend Build**: Compilar React a archivos estáticos (`html`, `css`, `js`) en la carpeta `dist`.
2.  **Backend Serve Static**: Configurar NestJS para servir estos archivos estáticos desde la raíz o una ruta específica.
3.  **Lanzador Invisible**: Crear un script `.vbs` en Windows para ejecutar el servidor sin ventana de consola visible.

---

## Pasos de Implementación

### 1. Preparación del Frontend
*   **Acción**: Ejecutar `npm run build` en la carpeta `/client`.
*   **Resultado**: Se generará una carpeta `client/dist` con la aplicación optimizada.
*   **Configuración**: Asegurar que `vite.config.ts` tenga la base path correcta (generalmente `./` o `/`).

### 2. Configuración del Backend (NestJS)
*   **Dependencia**: Instalar `@nestjs/serve-static`.
*   **Código**: 
    - Importar `ServeStaticModule` en `app.module.ts`.
    - Apuntar `rootPath` a la carpeta `client/dist`.
    - Configurar para que cualquier ruta no api (`!/api/*`) redirija al `index.html` (SPA Routing).

### 3. Script de Unificación (Build)
Crearemos un script en `package.json` raíz o un `.bat` que:
1.  Instale dependencias si faltan.
2.  Compile el Frontend.
3.  Copie/Mueva los archivos dist al lugar correcto si es necesario (o Nest los lea directo).
4.  Compile el Backend.

### 4. Lanzador Invisible (Windows)
Crearemos un archivo `IniciarLifeCanvas.vbs` con el siguiente contenido aproximado:
```vbscript
Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "C:\Ruta\Al\Proyecto\start_server.bat" & Chr(34), 0
Set WshShell = Nothing
```
*   El `0` al final indica "ventana oculta".

---

## Resolución de Problemas (Troubleshooting)

### A. El Frontend no carga (Pantalla en blanco)
*   **Causa**: NestJS no encuentra la carpeta estática.
*   **Solución**: Verificar `rootPath` en `AppModule`. Usar `join(__dirname, '..', '..', 'client', 'dist')` para asegurar rutas absolutas correctas relativas al `dist` del servidor.

### B. Rutas de React dan 404 al recargar
*   **Causa**: NestJS intenta manejar `/dashboard` como una ruta de API.
*   **Solución**: El módulo `ServeStatic` debe tener habilitado el fallback a `index.html`. Asegurar que los controladores de API tengan prefijo (ej. `/api` o endpoints específicos) para no chocar.

### C. Error de Permisos o Puertos
*   **Causa**: Puerto 3000 ocupado.
*   **Solución**: Matar procesos de Node desde el Administrador de Tareas antes de iniciar.

---
**Estado**: ⏳ Pendiente de implementación.
