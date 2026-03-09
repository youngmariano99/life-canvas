# Feature: Adaptación de la API Notes como Inbox (Sprint 6)

**Fecha:** 08 de Marzo de 2026
**Tipo:** Feature / Arquitectura Backend

## Descripción
Para el desarrollo de la Bandeja de Entrada del Método GTD (Inbox) en el Sprint 6, se tomó la decisión arquitectónica de **no crear una nueva entidad** en la base de datos temporalmente. En su lugar, se demostró la robustez del esquema actual reutilizando la entidad `Notes`.

## Modificaciones y Flujo
- El componente frontend `QuickCaptureFAB` consume el endpoint heredado `POST /notes`.
- Se introducen las notas del buzón enviando el `folderId` vacío (`""` mapeando a `null` root) para mantenerlas fuera de cualquier libreta de áreas/proyectos.
- Se inyecta forzosamente un custom tag hardcodeado desde el cliente `tags: ["custom-inbox"]` o simplemente identificando su orfandad de carpetas.

## Efectos a Futuro
- Al llegar al Sprint 9 (Segundo Cerebro completo), se contemplará la necesidad real de separar las `Notes` del `Inbox` a nivel tabla, o si se oficializa un tipo híbrido. Por ahora, el rendimiento es O(1) y no hay tablas anidadas conflictivas.
