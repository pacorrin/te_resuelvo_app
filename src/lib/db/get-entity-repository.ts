import type { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";

/**
 * Dev: string name survives Next.js HMR when entity class references are re-instantiated.
 * Prod: class reference survives bundle minification together with ensureEntityMetadataReady().
 */
export function getEntityRepository<Entity extends ObjectLiteral>(
  dataSource: DataSource,
  entity: EntityTarget<Entity>,
  entityName: string,
): Repository<Entity> {
  if (process.env.NODE_ENV === "development") {
    return dataSource.getRepository(entityName);
  }
  return dataSource.getRepository(entity);
}
