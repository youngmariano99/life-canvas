# Funcionalidades - Life-OS 2026

## Resumen de Funcionalidades

Life-OS implementa la metodología **Superhábitos** con las siguientes áreas:

| Área | Descripción |
|------|-------------|
| **Identidad** | Visión a 5 años, misión anual, roles de vida |
| **Planificación** | Objetivos por trimestre, proyectos, recursos |
| **Ejecución** | Piedra del día, hábitos, actividades |
| **Seguimiento** | Fitness, calendario, aprendizajes |
| **Documentación** | Notas, pizarras, documentos |

---

## 1. Wizard de Configuración

### Flujo

```
Paso 1: Visión → Paso 2: Misión → Paso 3: Roles → Paso 4: Objetivos → Paso 5: Hábitos
```

### Paso 1 - Visión a 5 Años

- **Campo**: Textarea para describir dónde te ves en 5 años
- **Imágenes**: Opción de agregar URLs de imágenes inspiracionales
- **Persistencia**: `yearSettings.vision5Years` y `yearSettings.visionImages`

### Paso 2 - Misión del Año

- **Misión**: Declaración de propósito para el año
- **H1 Priority**: Prioridad del primer semestre
- **H2 Priority**: Prioridad del segundo semestre
- **Persistencia**: `yearSettings.mission`, `h1Priority`, `h2Priority`

### Paso 3 - Roles de Vida

- **Límite**: Máximo 7 roles (metodología Superhábitos)
- **Campos por rol**:
  - Nombre
  - Ícono (seleccionable de Lucide)
  - Color (7 opciones semánticas)
  - Descripción (opcional)
- **Colores disponibles**: student, athlete, entrepreneur, creative, family, spiritual, social

### Paso 4 - Objetivos Anuales

- **Organización**: Por rol y trimestre
- **Campos por objetivo**:
  - Título
  - Descripción (opcional)
  - Trimestre (Q1-Q4)
  - Estado inicial (pending)

### Paso 5 - Hábitos

- **Vinculación**: Opcional a un rol
- **Frecuencia**: Diaria, días de semana, fin de semana, personalizada
- **Campos**:
  - Nombre
  - Rol asociado (opcional)
  - Frecuencia

---

## 2. Vista de Identidad

### Sección de Visión

- Tarjeta destacada con la visión a 5 años
- Carrusel de imágenes de visión (si existen)
- Botón para editar (abre wizard)

### Sección de Misión

- Misión del año
- Prioridades semestrales (H1/H2)

### Sección de Roles

- Grid de tarjetas de roles (máximo 7)
- Cada tarjeta muestra:
  - Ícono y nombre
  - Color distintivo
  - Descripción
  - Resumen de objetivos asociados

---

## 3. Vista Semestral (Roadmap)

### Selector de Semestre

- Toggle entre H1 (Q1+Q2) y H2 (Q3+Q4)
- Muestra prioridad del semestre activo

### Vista por Trimestres

- 2 columnas: un trimestre cada una
- Objetivos organizados por rol
- Indicador de progreso por objetivo

### Gestión de Recursos

- Cada objetivo puede tener recursos asociados
- Campos:
  - Nombre del recurso
  - Cantidad que tienes
  - Cantidad que necesitas
  - Unidad (USD, horas, etc.)
- Barra de progreso visual

### Estados de Objetivos

| Estado | Color | Descripción |
|--------|-------|-------------|
| pending | Gris | Sin iniciar |
| in_progress | Azul | En curso |
| completed | Verde | Completado |
| deferred | Amarillo | Postergado |

---

## 4. Vista Semanal (Kanban)

### Selector de Proyecto

- Dropdown con proyectos agrupados por objetivo
- Botón para crear nuevo proyecto

### Tablero Kanban

- Columnas por defecto: "Por hacer", "En progreso", "En revisión", "Completada"
- Columnas personalizables por proyecto
- Tarjetas de actividad arrastrables

### Actividades

- Título
- Fecha límite (opcional)
- Estado (columna actual)
- Orden dentro de la columna

---

## 5. Vista Diaria (Ejecución)

### Selector de Fecha

- Calendario para navegar entre días
- Indicador del día actual

### Piedra del Día

- **Concepto**: El objetivo más importante del día
- Campos:
  - Título
  - Rol asociado (opcional)
  - Estado de completado
- Una piedra por día

### Tracker de Hábitos

- Grid semanal (Lun-Dom)
- Hábitos agrupados por rol
- Estados por clic:
  1. Vacío → Completado ✓
  2. Completado → Fallido ✗
  3. Fallido → Día libre ○
  4. Día libre → Vacío

### Calendario de Eventos

- Eventos del día seleccionado
- Tags de colores:
  - 🎂 Cumpleaños (rosa)
  - ⏰ Recordatorio (ámbar)
  - 📅 Cita (azul)
  - 📝 Examen (rojo)
  - ⚠️ Deadline (naranja)
  - 💜 Personal (púrpura)
  - 🏷️ Custom (gris + color personalizado)

---

## 6. Área de Fitness

### Tipos de Actividad

| Tipo | Descripción | Campos Específicos |
|------|-------------|-------------------|
| **NEAT** | Actividad física no ejercicio (caminatas, tareas) | Pasos, Distancia, Calorías |
| **Workout** | Entrenamientos estructurados y rutinas | Duración, Calorías, Distancia, Rutina asociada |

### Gestión de Rutinas

- **Creación Dinámica**: Formularios adaptables según el tipo de estructura:
  - **Series y Repeticiones**: Ejercicios clásicos de gimnasio.
  - **Rondas (Circuitos)**: Definición de vueltas globales y metas por ejercicio.
  - **Intervalos**: Configuración de Series x Trabajo / Descanso.
  - **Tiempo Fijo**: Objetivo de tiempo total.
  - **Distancia Fija**: Objetivo de distancia total.
- **Selector de Rutinas**: Previsualización inteligente del contenido de la rutina antes de seleccionarla.
- **Auto-completado**: Al seleccionar una rutina, se rellena automáticamente el nombre y la estructura detallada en las notas.

### Registro de Actividad

- **Tabs Separados**: Flujos distintos para "Entrenamiento" y "NEAT".
- **Entrenamiento**:
  - Opción Manual: Ingreso directo de métricas.
  - Opción Rutina: Carga desde librería de rutinas personales.
- **NEAT**: Formulario simplificado enfocado en movimiento diario (Pasos/Km).

### Visualización y Edición

- **Calendario Mensual**:
  - Resumen visual con puntos de color (Rojo: Workout, Verde: NEAT).
  - Navegación entre meses y selección de días.
- **Lista de Actividades**:
  - Tarjetas con iconos distintivos y métricas clave.
- **Modal de Detalle (Nuevo)**:
  - Al hacer clic en una actividad, se abre un modal con el resumen completo.
  - **Edición**: Posibilidad de modificar nombre, duración, calorías, distancia y notas.
  - **Eliminación**: Opción para borrar la actividad desde el detalle.

---

## 7. Sistema de Notas

### Estructura de Carpetas

- Carpetas anidables (parentId)
- Campos:
  - Nombre
  - Color (opcional)
  - Ícono (opcional)

### Tipos de Nota

#### 1. Nota de Texto

- Editor TipTap con formato enriquecido
- Atajos estilo Markdown:
  - `# ` → H1
  - `## ` → H2
  - `- ` → Lista
  - `[] ` → Checkbox
  - `> ` → Cita
- Soporte para tareas con checkbox
- Auto-guardado con debounce

#### 2. Pizarra (Whiteboard)

- Integración con Excalidraw
- Herramientas:
  - Dibujo libre
  - Formas geométricas
  - Texto
  - Flechas
- Exportación a PNG
- Guardado en JSON

#### 3. Documento

- Subida de archivos
- Tipos soportados: imágenes, PDF, Excel, etc.
- Almacenamiento en Base64 (temporal)
- Metadatos: nombre, tipo, tamaño

### Sistema de Etiquetas

- Tipos:
  - Vinculada a Rol
  - Vinculada a Objetivo
  - Vinculada a Proyecto
  - Personalizada
- Color personalizable
- Filtrado por etiquetas

### Funcionalidades

- Búsqueda de notas
- Filtro por carpeta
- Pin de notas importantes
- Ordenamiento por fecha

---

## 8. Log de Aprendizajes

### Concepto

Registro de "desvíos" (cuando no se cumple un hábito u objetivo) convertidos en aprendizajes.

### Campos

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| Qué pasó | Sí | Descripción del desvío |
| Acción de ajuste | Sí | Qué harás diferente |
| Lección aprendida | No | Insight obtenido |

### Vinculación (opcional)

- A un objetivo específico
- A un hábito específico

---

## 9. Tema Claro/Oscuro

### Implementación

- Hook `useTheme` con detección de preferencia del sistema
- Persistencia en localStorage
- Clases de Tailwind con `dark:` variants
- Toggle en el header

### Variables CSS

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  /* ... */
}

.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  /* ... */
}
```

---

## 10. Modo Focus

### Concepto

Modo simplificado que oculta elementos distractores.

### Activación

- Toggle `focusMode` en el estado
- Afecta la visibilidad de:
  - Elementos secundarios
  - Navegación extendida
  - Estadísticas

---

## 11. Reset de Datos

### Funcionalidad

- Botón en el header con confirmación
- Elimina TODO el localStorage
- Regresa al wizard inicial
- Útil para empezar de nuevo

### Confirmación

- AlertDialog con mensaje de advertencia
- Acción irreversible
