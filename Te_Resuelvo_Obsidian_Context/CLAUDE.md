# Te Resuelvo — Segundo Cerebro

Este directorio es una wiki de conocimiento persistente sobre **Te Resuelvo**, un marketplace de servicios para el hogar (arranca con aire acondicionado como rubro ancla). El dueño de este contexto es Francisco, freelancer/desarrollador que además de construir el producto (`teresuelvo_app`) quiere usar este cerebro para: generar features con IA más precisas y alineadas al negocio, detectar mejoras de proceso, y tomar mejores decisiones de largo plazo sobre el proyecto dentro de su portafolio de trabajo.

**Regla de scope importante:** Francisco tiene otros proyectos de cliente en su Notion (ej. "Pre15na" y "KOVAN" bajo el workspace "KRONOX DESARROLLO" — un sistema de cartera/créditos/medidores). **Esos NO son Te Resuelvo** y nunca deben mezclarse en esta wiki salvo que él lo pida explícitamente como referencia cruzada de patrones de negocio.

## Arquitectura de este directorio

```
raw/                  # Fuentes crudas e inmutables. La IA lee de aquí, nunca las edita.
  notion/             # Exports/snapshots de páginas de Notion ya procesadas
  minutas/            # Minutas de reuniones (cuando existan)
  prd/                # PRDs y documentos de producto (cuando existan)
wiki/                 # Conocimiento sintetizado y mantenido por la IA. Se edita libremente.
  negocio/            # Modelo de negocio, monetización, mercado, estrategia
  producto/           # MVP, features, flujos de usuario, roadmap
  tecnico/            # Arquitectura del código, stack, entidades, dominios
  decisiones/         # Decisiones de negocio/producto/técnicas con su razonamiento (ADR-style)
  procesos/           # Procesos operativos y de desarrollo (cómo se trabaja, no qué se construye)
  personas/           # Proveedores clave, stakeholders, roles (cuando aplique)
  index.md            # Catálogo de todas las páginas de la wiki
  log.md              # Registro cronológico de ingests, queries y lint passes
```

## Cómo trabajar en este cerebro

### Ingest (agregar una fuente nueva)
1. Si la fuente viene de Notion: usa las herramientas de Notion MCP (`notion-search`, `notion-fetch`) para traer el contenido. Guarda un snapshot en `raw/notion/<slug>.md` con el link original al inicio.
2. Si es una minuta de reunión: guárdala en `raw/minutas/YYYY-MM-DD-tema.md`.
3. Si es un PRD: guárdalo en `raw/prd/`.
4. Si es código fuente: **no se copia** a `raw/` — se lee directamente de `../teresuelvo_app` y se sintetiza en `wiki/tecnico/`.
5. Lee la fuente, identifica qué páginas de `wiki/` deben crearse o actualizarse (una fuente puede tocar varias páginas — negocio, producto, técnico, decisiones).
6. Actualiza `wiki/index.md` y agrega una entrada a `wiki/log.md` con el formato `## [YYYY-MM-DD] ingest | Título de la fuente`.
7. Enlaza cross-references con `[[nombre-de-pagina]]` (sintaxis de Obsidian).

### Query (responder preguntas)
1. Lee `wiki/index.md` primero para ubicar páginas relevantes.
2. Lee las páginas específicas necesarias, no todo el directorio.
3. Si la respuesta genera una síntesis nueva de valor (comparación, análisis, recomendación de feature), ofrece archivarla como página nueva en `wiki/` en vez de dejarla solo en el chat.
4. Cuando la pregunta trate de features nuevas a construir con IA: cruza `wiki/tecnico/` (qué existe y cómo está estructurado) con `wiki/negocio/` y `wiki/producto/` (qué se necesita y por qué) antes de proponer implementación.

### Lint (mantenimiento periódico)
Cuando Francisco lo pida ("revisa la wiki", "haz un lint"), revisa:
- Contradicciones entre páginas (ej. un modelo de cobro documentado en dos lugares con cifras distintas)
- Páginas huérfanas sin enlaces entrantes
- Conceptos de negocio mencionados pero sin página propia
- Desalineación entre lo documentado en `wiki/negocio` o `wiki/producto` y lo que realmente existe en el código (`wiki/tecnico`) — este es el gap más valioso para Francisco porque ahí es donde vive la brecha entre visión de negocio y lo construido.

## Convenciones de las páginas wiki

- Cada página lleva frontmatter YAML mínimo:
  ```yaml
  ---
  tipo: negocio | producto | tecnico | decision | proceso | persona
  actualizado: YYYY-MM-DD
  fuentes: [raw/notion/archivo.md, ...]
  ---
  ```
- Usa `[[nombre-de-pagina]]` para enlazar a otras páginas de la wiki (funciona nativo en Obsidian).
- Las páginas de `decisiones/` siguen formato ligero ADR: **Contexto → Decisión → Por qué → Alternativas consideradas → Estado** (vigente/revisada/descartada).
- Prioriza claridad y síntesis sobre exhaustividad — esta wiki es para tomar decisiones rápido, no para archivar transcripciones completas (eso vive en `raw/`).
- Idioma: español, salvo términos técnicos de código (nombres de entidades, funciones) que se mantienen en inglés tal como están en el repo.

## Relación con el código fuente

El código vive en `../teresuelvo_app` (Next.js 16 + React 19 + TypeScript, TypeORM/MySQL, NextAuth, Stripe, Tailwind). Esta wiki **no duplica el código ni la documentación técnica que ya existe en el repo** (`teresuelvo_app/docs/ai/*`, `.cursorrules`) — los referencia y sintetiza a nivel de negocio/producto. Antes de proponer una feature nueva, siempre revisa `wiki/tecnico/arquitectura.md` y `wiki/tecnico/dominios.md` para no reinventar algo que ya existe, y respeta el flujo de capas documentado ahí (UI → Server Action → Service → Repository → TypeORM) al sugerir implementaciones.

## Fuentes de Notion ya mapeadas

El workspace de Notion de Te Resuelvo vive bajo la página raíz "Te resuelvo" (sin subespacio de proyecto formal todavía — es distinto de los proyectos de cliente "Pre15na"/"KOVAN" bajo "KRONOX DESARROLLO"). Al buscar más contexto, usa `notion-search` con queries como "Te Resuelvo", y evita confundir resultados de otros proyectos que comparten palabras comunes (ej. "servicios", "PRD").
