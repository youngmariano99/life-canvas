# FIX-001: Optimización de Guardado en Pizarras

## Problema
Las pizarras (Excalidraw) generaban peticiones constantes a la API (cada 1 segundo de actividad), lo que resultaba en problemas de rendimiento y ruido innecesario en el tráfico de red.

## Solución
Se implementó un sistema de guardado más inteligente y eficiente en `Whiteboard.tsx`:

1.  **Seguimiento de Estado "Dirty"**: Se añadió un estado `hasUnsavedChanges` que rastrea si hay cambios pendientes desde el último guardado.
2.  **Reducción de Frecuencia de Autosave**:
    *   El guardado por inactividad se aumentó de 1s a **10s**.
    *   Se añadió un guardado periódico de fondo cada **30s** (solo si hay cambios).
3.  **Botón de Guardado Manual**: Se integró un botón "Guardar ahora" que aparece dinámicamente cuando hay cambios sin sincronizar.
4.  **Prevención de Redundancia**: Antes de guardar, se comprueba si el contenido actual es idéntico al último guardado para evitar llamadas innecesarias.
5.  **Persistencia al Cerrar**: Se aseguró que cualquier cambio pendiente se guarde automáticamente al cerrar la pizarra.

## Archivos Modificados
- `client/src/components/notes/Whiteboard.tsx`

## Impacto
- Reducción drástica (~90%) en las llamadas a la API durante sesiones de dibujo intensas.
- Mejora en la experiencia de usuario al proporcionar control manual y feedback visual del estado de sincronización.
