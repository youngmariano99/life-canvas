# Feature: Accesibilidad de Captura Rápida "Inbox" (Sprint 6)

**Fecha:** 08 de Marzo de 2026
**Tipo:** Feature / Accesibilidad

## Descripción
Implementación del concepto "GTD Inbox" (Bandeja de Entrada) o vaciado mental: Un sistema ubicuo flotante donde el usuario puede volcar sus ideas antes de perder el enfoque en la tarea actual. 

## Cambios Realizados
1. **Componente `QuickCaptureFAB.tsx`:** Floating Action Button instalado en el archivo base `App.tsx`/`Index.tsx`. Funciona visualmente en la esquina y puede llamarse mediante los shortcuts universales `Ctrl + K` o `Cmd + K`. Presenta un textarea modal que invoca al endpoint provisional de subida mediante Enter o Command+Enter.
2. **Componente `InboxView.tsx`:** Una nueva vista de UI insertada en los sub-menús del Dashboard que filtra especificamente las Notas que en el backend consten con el tag `custom-inbox` para que el cerebro de revisión semanal las procese.

## Efectos Colaterales
* En base de datos, el flujo Inbox se mapea "de momento" usando la API y Entidades nativas de `Notes` para evitar ensuciar schema y mantener retrocompatibilidad hasta que el módulo evolucione en Sprint 9.
