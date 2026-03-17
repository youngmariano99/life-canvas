Catálogo normalizado + Snapshots inmutables. Aquí te explico la arquitectura sugerida en TypeScript para mantener la flexibilidad, sin perder el historial fiel, y aprovechando tu stack.

1. Reestructuración de Datos (TypeScript Interfaces)
Vamos a introducir el concepto de Bloques (Mesociclos) y un Catálogo de Ejercicios, pero la actividad final guardará una "foto" exacta de lo que hiciste ese día.

TypeScript
// 1. El Catálogo (Para poder trackear PRs y estadísticas)
interface Exercise {
  id: string; // ej: 'pullups-bw'
  name: string; // 'Dominadas'
  category: 'Fuerza' | 'Cardio' | 'Flexibilidad';
  // Aquí puedes guardar los PRs cacheados para no recalcular siempre
  records?: { maxWeight: number; maxReps: number; maxVolume: number }; 
}

// 2. La Plantilla del Bloque (El plan de 4 semanas)
interface TrainingBlock {
  id: string;
  name: string; // ej: 'Fuerza Base - Tren Superior'
  durationWeeks: number; // ej: 4
  isActive: boolean;
  routines: BlockRoutineProgression[];
}

// 3. La Progresión dentro del Bloque
interface BlockRoutineProgression {
  routineName: string; // ej: 'Tren Superior A'
  exercises: {
    exerciseId: string; // Referencia al catálogo
    // Array de longitud = durationWeeks
    weeklyTargets: {
      week: number;
      sets: number;
      reps: number | string; // Puede ser 5 o "Al fallo"
      weight?: number; // kg
    }[];
  }[];
}

// 4. La Actividad (El Snapshot inmutable para reemplazar el texto plano)
interface FitnessActivity {
  id: string;
  date: string; // Fecha de ejecución
  type: 'Workout' | 'NEAT';
  // En lugar de (o además de) un string de texto, guardamos data estructurada:
  performanceSnapshot?: {
    exerciseId: string; // Permite linkear para ver el progreso
    exerciseName: string; // Se guarda el nombre por si el ID original se borra a futuro
    setsDone: { reps: number; weight: number; completed: boolean }[];
  }[];
  notes: string; // Mantenemos TipTap para sensaciones del día ("Me dolió el hombro", etc.)
}
2. Flujo de Trabajo en la Interfaz (React + shadcn/ui)
Con esta estructura, el flujo en tu aplicación se dividiría en tres fases claras:

A. El Planificador (Block Builder)
Al crear un bloque, la UI te permite definir la rutina base y "proyectarla".

UI sugerida: Una tabla donde las filas son los ejercicios (Dominadas, Fondos, Abs) y las columnas son las Semanas (1 a 4).

Puedes usar un input rápido para llenar la semana 1 (2x5) y un botón de "Autocompletar progresión" que automáticamente sume 1 repetición o 2.5kg a las semanas siguientes basándose en una regla simple.

B. El Día de Entrenamiento (Execution Mode)
Cuando abres la app para entrenar, el sistema detecta que estás en la "Semana 2" de tu bloque activo.

Te carga la FitnessActivity pre-llenada con los targets de esa semana (ej: Dominadas 2x6).

UX: Usando los checkboxes de shadcn/ui, simplemente marcas si completaste la serie. Si hiciste más o menos (ej: lograste 7 en vez de 6), editas el número ahí mismo. Esa data se guarda en el performanceSnapshot.

C. El Resumen y Actualización (Block Review)
Al terminar la semana 4, disparas un modal ("Finalizar Bloque").

El sistema lee todas las FitnessActivity de esas 4 semanas.

Te muestra un resumen: "Planeaste llegar a 3x7 en Dominadas, pero tu última sesión fue de 3x8".

Te da la opción con un clic de guardar esos números como la nueva base para el siguiente bloque.

3. El "Vault" de Ejercicios (Historial y PRs)
Al tener el exerciseId linkeado en cada sesión, ahora puedes crear una vista dedicada para cada movimiento.

Gráficos: Usando una librería ligera o componentes nativos, puedes mapear un useEffect que traiga todas las FitnessActivity donde exista el exerciseId === 'pullups-bw', extrayendo la fecha y el volumen total (Series x Reps x Peso) para dibujar una línea de progreso temporal.

Métricas Rápidas: Podrás mostrar componentes tipo "Tarjeta" con:

Última vez realizado: (Calculado con date-fns viendo la fecha más reciente).

Récord de Peso (1RM estimado).

Récord de Volumen.