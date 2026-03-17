# Guía Funcional - Life-OS 2026

**Life-OS 2026** es tu sistema operativo personal basado en la metodología de **Superhábitos**. Esta guía explica cada funcionalidad y cómo usarla para maximizar tu productividad.

## Índice

1.  [Configuración Inicial (Wizard)](#1-configuración-inicial-wizard)
2.  [Identidad y Visión](#2-identidad-y-visión)
3.  [Planificación Semestral](#3-planificación-semestral)
4.  [Ejecución Semanal y Diaria](#4-ejecución-semanal-y-diaria)
5.  [Área de Fitness](#5-área-de-fitness)
6.  [Sistema de Apuntes (Segundo Cerebro)](#6-sistema-de-apuntes-segundo-cerebro)
7.  [Calendario](#7-calendario)

---

## 1. Configuración Inicial (Wizard)

Al iniciar por primera vez (o tras un reset), el sistema te guiará por 5 pasos esenciales:

1.  **Visión a 5 Años**: Define quién quieres ser. Puedes pegar enlaces de imágenes (Pinterest, Unsplash) para crear un tablero de visión.
2.  **Misión del Año**: Tu "estrella norte" para el 2026 y tus prioridades principales semestrales (H1 y H2).
3.  **Roles de Vida**: Define hasta **7 roles** clave (ej: Estudiante, Atleta, Padre). Cada rol tiene un color y un ícono.
4.  **Objetivos Trimestrales**: Establece metas concretas para cada rol, asignándolas a un trimestre (Q1-Q4).
5.  **Hábitos**: Crea las rutinas diarias que sostendrán esos objetivos.

---

## 2. Identidad y Visión

Tu centro de mando personal. Aquí recuerdas *por qué* haces lo que haces.

*   **Visión Board**: Carrusel con tus imágenes inspiradoras y tu texto de visión.
*   **Tarjetas de Rol**: Un resumen visual de tus áreas de vida. Muestra cuántos objetivos y hábitos tienes activos en cada una.

---

## 3. Planificación Semestral

La vista estratégica ("Vista de Pájaro").

*   **Roadmap**: Visualiza tus objetivos organizados por trimestres (Q1/Q2 o Q3/Q4).
*   **Gestión de Recursos**: Para cada objetivo, puedes listar qué necesitas (dinero, tiempo, herramientas) y cuánto tienes.
*   **Estado de Objetivos**: Marca tus metas como `Pendiente`, `En Progreso`, `Completado` o `Diferido`.

---

## 4. Ejecución Semanal y Diaria

Donde ocurre la magia. Pasar de la planificación a la acción.

### Vista Semanal (Kanban de Proyectos)
Ideal para gestionar proyectos complejos.
*   Crea **Proyectos** vinculados a tus Objetivos.
*   Desglosa en **Actividades** pequeñas.
*   Mueve las tarjetas entre columnas: `Por hacer` -> `En progreso` -> `Completada`.

### Vista Diaria
Tu tablero para el día a día.
1.  **Piedra del Día**: El ÚNICO objetivo que, si lo cumples, hace que el día valga la pena.
2.  **Tracker de Hábitos**:
    *   Clic 1 (Verde): Completado ✅
    *   Clic 2 (Rojo): Fallido ❌
    *   Clic 3 (Gris): Día libre ⚪
    *   Clic 4: Limpiar
3.  **Agenda**: Tus eventos del calendario para hoy.

---

## 5. Área de Fitness

El sistema de Fitness está diseñado para equilibrar el rendimiento cognitivo con la salud física mediante un seguimiento híbrido.

### 5.1. NEAT (Actividad No Deportiva)
Registra la actividad "invisible" que mantiene activo tu metabolismo fuera del gimnasio.
*   **Seguimiento**: Pasos diarios, caminatas al trabajo, o actividad constante.
*   **Métrica Principal**: Distancia/Pasos y Calorías estimadas.
*   **Uso**: Ideal para asegurar que incluso en días de mucho trabajo sedentario, mantengas un nivel base de movimiento.

### 5.2. Workouts (Entrenamientos)
Registro de sesiones de ejercicio formal.
*   **Modo Manual**: Permite registrar rápidamente el nombre, duración (min), calorías (kcal) y distancia (km/pasos).
*   **Visualización**: Calendario inteligente que diferencia entre días de NEAT (punto azul) y días de Entrenamiento (punto verde/atleta).

### 5.3. El Sistema de Rutinas
Para evitar la fricción al registrar, puedes crear plantillas inteligentes:
*   **Tipos de Estructura**:
    *   **Series y Repeticiones**: Estructura clásica de pesas/fuerza (ej: Press Banca 3x12).
    *   **Rondas / Circuito**: Ideal para Crossfit o HIIT, con una meta global de rondas.
    *   **Intervalos**: Estructura Work/Rest (ej: 30s de trabajo / 15s de descanso).
    *   **Tiempo/Distancia Fija**: Metas específicas para cardio (ej: "Correr 5km" o "Yoga 45min").
*   **Uso con un Clic**: Al seleccionar una rutina guardada, el sistema autocompleta todos los detalles técnicos, permitiéndote registrar sesiones complejas en segundos.

### 5.4. Estructura de Datos y Persistencia
Es importante entender que el sistema de Fitness prioriza la **flexibilidad sobre la rigidez relacional**:
*   **Sin Entidades de "Ejercicio"**: A diferencia de otras apps, no existe una base de datos maestra de ejercicios (ej: "Press de Banca" no es un objeto que edites centralizadamente). Los ejercicios son **nombres de texto estáticos** dentro de una Rutina.
*   **Lógica de "Flattening" (Aplanamiento)**: Cuando registras una actividad basada en una rutina, el sistema toma la estructura compleja de la rutina (series, reps, intervalos) y la convierte en un bloque de texto enriquecido que se guarda en el campo `notes` de la `FitnessActivity`.
*   **Ventaja**: Esto permite modificar una rutina en el futuro sin alterar el historial de cómo entrenaste meses atrás, manteniendo un registro fiel de lo que hiciste en ese momento exacto.

---

## 6. Sistema de Apuntes (Segundo Cerebro)

Olvídate de Notion. Todo integrado.

*   **Carpetas Anidadas**: Organiza tu conocimiento jerárquicamente.
*   **Tipos de Notas**:
    1.  **Texto**: Editor rico con soporte para tareas, negritas, listas.
    2.  **Pizarra (Whiteboard)**: Dibuja flujos, diagramas o esquemas a mano alzada.
    3.  **Documentos**: Sube Archivos (PDF, Imágenes) para tenerlos a mano.

---

## 7. Calendario

Gestión de eventos temporales.
*   **Etiquetas de Color**: Cumpleaños (Rosa), Exámenes (Rojo), Citas (Azul), etc.
*   Visualización mensual clara.

---

### Tips Pro

*   **Modo Focus**: Actívalo en el menú superior para ocultar distracciones y ver solo lo esencial.
*   **Tema Oscuro**: Descansa tu vista activando el modo noche.
*   **PWA**: Instala la web como App en tu celular (Android/iOS) para usarla como una aplicación nativa.
