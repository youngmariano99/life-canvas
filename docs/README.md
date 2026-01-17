# Life-OS 2026 - Documentación Técnica Completa

## Índice

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Documentación Detallada](#documentación-detallada)

---

## Visión General

**Life-OS 2026** es una aplicación web de productividad personal basada en la metodología **Superhábitos**. Permite a los usuarios planificar su año, definir roles de vida, establecer objetivos, trackear hábitos y gestionar proyectos de forma integral.

### Filosofía de Diseño

- **Zen Productivity Theme**: Estética minimalista con colores suaves y transiciones fluidas
- **Mobile-First**: Diseño responsivo que funciona en cualquier dispositivo
- **Modo Oscuro/Claro**: Soporte completo para ambos temas
- **Sin Backend Requerido**: Toda la data se persiste en localStorage (preparado para migrar a Supabase)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  (Router principal + LifeOSProvider)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  YearWizard     │    │         Dashboard                │ │
│  │  (Configuración │    │  ┌─────────────────────────────┐ │ │
│  │   inicial)      │    │  │  Header + Navigation        │ │ │
│  └─────────────────┘    │  ├─────────────────────────────┤ │ │
│                         │  │  Views:                     │ │ │
│                         │  │  - IdentityView             │ │ │
│                         │  │  - SemesterView             │ │ │
│                         │  │  - WeeklyView               │ │ │
│                         │  │  - DailyView                │ │ │
│                         │  │  - FitnessArea              │ │ │
│                         │  │  - NotesSection             │ │ │
│                         │  │  - DeviationLog             │ │ │
│                         │  └─────────────────────────────┘ │ │
│                         └─────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    LifeOSContext                             │
│  (React Context + useLifeOS hook)                           │
├─────────────────────────────────────────────────────────────┤
│                    lifeOSStore                               │
│  (Funciones puras de state management + localStorage)       │
└─────────────────────────────────────────────────────────────┘
```

### Patrón de Estado

1. **`lifeOSStore.ts`**: Funciones puras que transforman el estado
2. **`useLifeOS.ts`**: Hook que expone el estado y acciones
3. **`LifeOSContext.tsx`**: Provider que comparte el estado globalmente
4. **Persistencia**: Automática en localStorage tras cada cambio

---

## Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React 18** | UI Framework |
| **TypeScript** | Tipado estático |
| **Vite** | Build tool y dev server |
| **Tailwind CSS** | Estilos utility-first |
| **shadcn/ui** | Componentes base |
| **Framer Motion** | Animaciones |
| **Lucide React** | Iconografía |
| **TipTap** | Editor de texto enriquecido |
| **Excalidraw** | Pizarras interactivas |
| **date-fns** | Manipulación de fechas |

---

## Estructura de Archivos

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   ├── layout/
│   │   └── Dashboard.tsx      # Layout principal
│   ├── views/                 # Vistas principales
│   │   ├── IdentityView.tsx
│   │   ├── SemesterView.tsx
│   │   ├── WeeklyView.tsx
│   │   └── DailyView.tsx
│   ├── wizard/               # Wizard de configuración
│   ├── roles/                # Componentes de roles
│   ├── habits/               # Tracker de hábitos
│   ├── notes/                # Sistema de notas
│   ├── fitness/              # Área de fitness
│   ├── calendar/             # Calendario de eventos
│   ├── weekly/               # Kanban de proyectos
│   └── deviations/           # Log de aprendizajes
├── context/
│   └── LifeOSContext.tsx     # Context provider
├── hooks/
│   ├── useLifeOS.ts          # Hook principal de estado
│   ├── useTheme.ts           # Hook de tema claro/oscuro
│   └── use-mobile.tsx        # Detección de móvil
├── store/
│   └── lifeOSStore.ts        # Lógica de persistencia
├── types/
│   └── lifeOS.ts             # Definiciones TypeScript
├── pages/
│   ├── Index.tsx             # Página principal
│   └── NotFound.tsx          # 404
└── lib/
    └── utils.ts              # Utilidades (cn, etc.)
```

---

## Documentación Detallada

Para información más detallada, consulta los siguientes documentos:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura detallada y patrones de diseño
- **[DATA_MODELS.md](./DATA_MODELS.md)** - Modelos de datos y tipos TypeScript
- **[COMPONENTS.md](./COMPONENTS.md)** - Documentación de componentes
- **[STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)** - Gestión de estado y persistencia
- **[FEATURES.md](./FEATURES.md)** - Funcionalidades y flujos de usuario
- **[STYLING.md](./STYLING.md)** - Sistema de diseño y temas
- **[DATABASE.md](./DATABASE.md)** - Schema SQL para migración a Supabase

---

## Inicio Rápido para Desarrolladores

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

### Variables de Entorno

Actualmente no se requieren variables de entorno. El proyecto usa localStorage para persistencia.

### Flujo de Desarrollo

1. Modifica los tipos en `src/types/lifeOS.ts`
2. Añade funciones de store en `src/store/lifeOSStore.ts`
3. Expón las acciones en `src/hooks/useLifeOS.ts`
4. Consume el contexto en componentes con `useLifeOSContext()`
