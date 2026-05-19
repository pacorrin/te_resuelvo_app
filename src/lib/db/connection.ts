import "reflect-metadata";
import type { DataSource } from "typeorm";

const globalForDb = global as unknown as {
  dataSource: DataSource | undefined;
};

async function dataSourceHasAllEntities(ds: DataSource): Promise<boolean> {
  const { APP_ENTITIES } = await import("./data-source");
  return APP_ENTITIES.every((entity) => ds.hasMetadata(entity));
}

async function destroyDataSource(ds: DataSource | undefined): Promise<void> {
  if (ds?.isInitialized) {
    await ds.destroy();
  }
}

export const getDataSource = async () => {
  const { AppDataSource } = await import("./data-source");

  if (globalForDb.dataSource?.isInitialized) {
    if (await dataSourceHasAllEntities(globalForDb.dataSource)) {
      return globalForDb.dataSource;
    }
    await destroyDataSource(globalForDb.dataSource);
    globalForDb.dataSource = undefined;
  }

  if (AppDataSource.isInitialized && !(await dataSourceHasAllEntities(AppDataSource))) {
    await destroyDataSource(AppDataSource);
  }

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  if (process.env.NODE_ENV !== "production") {
    globalForDb.dataSource = AppDataSource;
  }

  return AppDataSource;
};
