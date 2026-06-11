type EntityClass = new (...args: unknown[]) => unknown;

/**
 * Production bundles may minify class names (e.g. Service -> "j"), which breaks
 * TypeORM metadata validation and repository lookups. Restore canonical names
 * before DataSource initialization.
 */
export function stabilizeEntityClassNames(
  entities: ReadonlyArray<{ entity: EntityClass; name: string }>,
): void {
  for (const { entity, name } of entities) {
    Object.defineProperty(entity, "name", {
      value: name,
      configurable: true,
    });
  }
}
