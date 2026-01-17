# Sistema de Estilos - Life-OS 2026

## Stack de Estilos

| Tecnología | Uso |
|------------|-----|
| **Tailwind CSS** | Framework utility-first |
| **shadcn/ui** | Componentes pre-estilizados |
| **CSS Variables** | Tokens de diseño |
| **Framer Motion** | Animaciones |

---

## Archivos de Configuración

### tailwind.config.ts

```typescript
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores semánticos
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        
        // Colores de roles
        role: {
          student: "hsl(var(--role-student))",
          athlete: "hsl(var(--role-athlete))",
          entrepreneur: "hsl(var(--role-entrepreneur))",
          creative: "hsl(var(--role-creative))",
          family: "hsl(var(--role-family))",
          spiritual: "hsl(var(--role-spiritual))",
          social: "hsl(var(--role-social))",
        }
      }
    }
  }
}
```

### index.css (Variables)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "@fontsource-variable/plus-jakarta-sans";

:root {
  /* Colores base - Modo claro */
  --background: 60 9% 98%;
  --foreground: 24 10% 10%;
  
  /* Componentes */
  --card: 60 9% 98%;
  --card-foreground: 24 10% 10%;
  --popover: 0 0% 100%;
  --popover-foreground: 24 10% 10%;
  
  /* Primario - Verde salvia */
  --primary: 142 40% 40%;
  --primary-foreground: 60 9% 98%;
  
  /* Secundario */
  --secondary: 60 5% 90%;
  --secondary-foreground: 24 10% 10%;
  
  /* Estados */
  --muted: 60 5% 90%;
  --muted-foreground: 24 6% 45%;
  --accent: 142 30% 90%;
  --accent-foreground: 142 40% 25%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 60 9% 98%;
  
  /* Bordes y focus */
  --border: 60 6% 85%;
  --input: 60 6% 85%;
  --ring: 142 40% 40%;
  
  /* Colores de roles */
  --role-student: 220 80% 55%;
  --role-athlete: 0 75% 55%;
  --role-entrepreneur: 35 90% 50%;
  --role-creative: 280 70% 60%;
  --role-family: 340 75% 55%;
  --role-spiritual: 180 50% 45%;
  --role-social: 160 60% 45%;
  
  /* Otros */
  --radius: 0.75rem;
  --sidebar-width: 16rem;
}

.dark {
  --background: 24 10% 10%;
  --foreground: 60 9% 98%;
  --card: 24 10% 12%;
  --card-foreground: 60 9% 98%;
  --popover: 24 10% 12%;
  --popover-foreground: 60 9% 98%;
  --primary: 142 40% 50%;
  --primary-foreground: 24 10% 10%;
  --secondary: 24 6% 20%;
  --secondary-foreground: 60 9% 98%;
  --muted: 24 6% 20%;
  --muted-foreground: 60 5% 60%;
  --accent: 142 30% 20%;
  --accent-foreground: 142 40% 80%;
  --border: 24 6% 25%;
  --input: 24 6% 25%;
}
```

---

## Paleta de Colores

### Colores Semánticos

| Token | Uso | Claro | Oscuro |
|-------|-----|-------|--------|
| `background` | Fondo general | Crema suave | Gris oscuro |
| `foreground` | Texto principal | Casi negro | Casi blanco |
| `primary` | Acciones principales | Verde salvia | Verde salvia claro |
| `secondary` | Fondos secundarios | Gris claro | Gris oscuro |
| `muted` | Elementos deshabilitados | Gris muy claro | Gris medio |
| `accent` | Destacados sutiles | Verde muy claro | Verde oscuro |
| `destructive` | Acciones peligrosas | Rojo | Rojo |

### Colores de Roles

| Rol | HSL | Hex aproximado |
|-----|-----|----------------|
| student | 220 80% 55% | #3B82F6 (Azul) |
| athlete | 0 75% 55% | #EF4444 (Rojo) |
| entrepreneur | 35 90% 50% | #F59E0B (Naranja) |
| creative | 280 70% 60% | #A855F7 (Púrpura) |
| family | 340 75% 55% | #EC4899 (Rosa) |
| spiritual | 180 50% 45% | #14B8A6 (Teal) |
| social | 160 60% 45% | #10B981 (Verde) |

---

## Tipografía

### Fuente Principal

**Plus Jakarta Sans** - Variable font

```css
body {
  font-family: "Plus Jakarta Sans Variable", system-ui, sans-serif;
}
```

### Escalas

| Clase | Tamaño | Uso |
|-------|--------|-----|
| `text-xs` | 12px | Labels pequeños |
| `text-sm` | 14px | Texto secundario |
| `text-base` | 16px | Texto principal |
| `text-lg` | 18px | Subtítulos |
| `text-xl` | 20px | Títulos de sección |
| `text-2xl` | 24px | Títulos de página |
| `text-3xl` | 30px | Títulos grandes |

---

## Espaciado

Usando el sistema de Tailwind (4px base):

| Clase | Valor | Uso común |
|-------|-------|-----------|
| `gap-1` | 4px | Entre íconos y texto |
| `gap-2` | 8px | Entre elementos relacionados |
| `gap-3` | 12px | Dentro de cards |
| `gap-4` | 16px | Entre secciones pequeñas |
| `gap-6` | 24px | Entre secciones medianas |
| `gap-8` | 32px | Entre secciones grandes |
| `p-4` | 16px | Padding de cards |
| `p-6` | 24px | Padding de contenedores |
| `px-4` | 16px | Padding horizontal de página |
| `py-8` | 32px | Padding vertical de página |

---

## Componentes UI

### Cards

```tsx
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

### Botones

```tsx
// Primario
<Button>Acción principal</Button>

// Secundario
<Button variant="secondary">Secundario</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost
<Button variant="ghost">Ghost</Button>

// Destructivo
<Button variant="destructive">Eliminar</Button>

// Solo ícono
<Button variant="ghost" size="icon">
  <Icon className="h-4 w-4" />
</Button>
```

### Inputs

```tsx
<Input 
  className="bg-background border-input" 
  placeholder="Escribe aquí..."
/>
```

---

## Animaciones

### Framer Motion

```tsx
// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>

// Lista stagger
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    />
  ))}
</motion.div>
```

### Transiciones CSS

```css
/* Transiciones suaves en botones */
.btn {
  @apply transition-all duration-200;
}

/* Hover effects */
.card {
  @apply hover:shadow-lg transition-shadow;
}
```

---

## Responsive Design

### Breakpoints

| Prefijo | Min-width | Dispositivo |
|---------|-----------|-------------|
| (default) | 0px | Móvil |
| `sm:` | 640px | Móvil grande |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Desktop grande |

### Patrones Comunes

```tsx
// Columnas responsivas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Ocultar en móvil
<div className="hidden md:block">

// Padding responsivo
<div className="px-4 sm:px-6 lg:px-8">

// Texto responsivo
<h1 className="text-xl sm:text-2xl lg:text-3xl">
```

---

## Dark Mode

### Implementación

1. Clase `dark` en `<html>`
2. Variables CSS diferentes para `.dark`
3. Clases `dark:` de Tailwind

### Ejemplos

```tsx
// Fondo que cambia
<div className="bg-background">

// Borde que cambia
<div className="border-border">

// Override explícito
<div className="bg-white dark:bg-gray-900">
```

### Hook useTheme

```tsx
const { theme, setTheme, toggleTheme } = useTheme();

// theme: 'light' | 'dark' | 'system'
// Persiste en localStorage
```

---

## Utilidades Personalizadas

### cn() - Class Name Merger

```tsx
import { cn } from "@/lib/utils";

// Combina clases condicionalmente
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
)}>
```

### Clases de Roles

```tsx
import { ROLE_COLORS } from "@/types/lifeOS";

const role = { color: "student" };
const colors = ROLE_COLORS[role.color];

<div className={cn(colors.bg, colors.text, colors.border)}>
```
