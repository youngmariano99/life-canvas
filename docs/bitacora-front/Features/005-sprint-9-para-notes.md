---
id: 005-sprint-9-para-notes
title: Segundo Cerebro y Método P.A.R.A 
date: 2026-03-08
type: feature
---

# 🚀 Sprint 9: Segundo Cerebro (Método PARA) - Completado

Este sprint se enfocó en darle orden metodológico inteligente a la sección de "Notas" o "Apuntes", resolviendo el problema de las notas huérfanas mediante la estructura de Tiago Forte (Proyectos, Áreas, Recursos y Archivo).

## ✨ Cambios Destacados

1. **Sidebar de Notas Inteligente (`NotesSection.tsx`):** 
   - Se rediseñó por completo el Panel de Navegación izquierdo.
   - **Proyectos:** Mapea automáticamente los Proyectos activos de tu Store y permite filtrar apuntes usando sus `tags` internas (`project-<id>`).
   - **Áreas:** Mapea a tus Roles (Identidades) brindando una carpeta virtual por rol (`role-<id>`).
   - **Recursos:** Preserva el sistema de carpetas manual preexistente para cajón de investigación suelta.
   - **Archivo:** Crea un filtro seguro (`system-archive`) para ocultar la basura.

2. **Dashboard de Proyecto Unificado (`ProjectsView.tsx`):**
   - Antes no existía una vista detallada unitaria por Proyecto, solo las "tarjetas" (Cards) en la grilla superior.
   - Se incorporó un **Modal de Dashboard Individual** (`Dialog`) al hacer click sobre un Proyecto.
   - Del lado izquierdo: Control de la ejecución (Checklist de `ProjectActivity`).
   - Del lado derecho: **Panel del Segundo Cerebro**. Lista únicamente y en tiempo real las notas conectadas al proyecto. Dispone un atajo + Nuevo para documentar ideas y redirigir allá manteniendo la "trazabilidad de foco".

## 🤔 Desafíos y Resoluciones

- **Restricción de Esquema (Schema Drift):** Las `Note` originales en el código no soportaban las columnas foráneas de `projectId` o `roleId`. 
  - *Solución:* Evitamos hacer una iteración compleja que forzara esquemas en SQL. Descubrimos que la App usaba un array `tags: string[]` polimórfico al cual aprovechamos conectando apuntes a través de la notación `project-[uuid]`. Esto mantiene la compatibilidad sin corromper el diseño de localforage.

Todos los puntos del Sprint 9 fueron testeados, con el compilador `npx tsc` reportando cero errores en los acoples.
