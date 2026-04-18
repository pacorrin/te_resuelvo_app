import "reflect-metadata";
import type { DataSource } from "typeorm";

const globalForDb = global as unknown as {
  dataSource: DataSource | undefined;
};

export const getDataSource = async () => {
  if (globalForDb.dataSource?.isInitialized) {
    return globalForDb.dataSource;
  }

  const { AppDataSource } = await import("./data-source");

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  if (process.env.NODE_ENV !== "production") {
    globalForDb.dataSource = AppDataSource;
  }

  return AppDataSource;
};
