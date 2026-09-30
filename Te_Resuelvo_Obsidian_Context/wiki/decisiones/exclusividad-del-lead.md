---
tipo: decision
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app/src/lib (Tender.repo.ts, TenderBuyerService)]
estado: abierto — pendiente de decisión de Francisco
---

# ¿El lead es exclusivo por organización?

## Contexto
Al analizar el matching Tender↔Organization ([[cobertura-geografica]]) y el flujo de compra ([[ciclo-de-vida-tender]]), se encontró que el código **no bloquea globalmente** un Tender tras ser vendido. La única exclusión implementada es: una organización no puede volver a comprar el mismo lead si ya lo pagó. No hay nada que impida que **otra** organización compre ese mismo Tender.

Esto contrasta con la intuición típica de un modelo "pago por lead" (normalmente el lead se vende una vez y se retira del pool), y con el principio de [[mvp-modelo-pago-por-lead]] de que el proveedor "desbloquea este cliente por $X" — lenguaje que sugiere exclusividad implícita, aunque el documento original no lo especifica explícitamente.

## Por qué importa
- Si es un bug: cada Tender vendido a más de una organización diluye el valor percibido del lead y puede generar quejas de proveedores (varios proveedores contactando al mismo cliente).
- Si es intencional: es una decisión de negocio válida (modelo tipo "primero en pagar, se lleva el ticket" o venta competitiva del mismo lead) pero debería estar documentada como tal, y potencialmente comunicada a los proveedores para gestionar expectativas.

## Opciones a evaluar
1. **Exclusividad estricta:** al confirmarse el primer pago (PAID), excluir el Tender del pool para todas las demás organizaciones.
2. **Exclusividad con límite:** vender el mismo lead a un máximo de N organizaciones (ej. 2-3), común en marketplaces de leads B2B.
3. **Mantener como está:** venta abierta sin límite, pero comunicarlo explícitamente como parte del modelo (leads "no exclusivos" suelen tener precio menor).

## Estado
Abierto. Pendiente de que Francisco decida y, según la respuesta, esto se convierte en una historia técnica concreta sobre `Tender.repo.ts` (agregar filtro de exclusión global) o se documenta como comportamiento intencional en [[modelos-de-cobro]].

## Relacionado
- [[ciclo-de-vida-tender]]
- [[cobertura-geografica]]
- [[gap-negocio-vs-producto]]
