import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "test",
  timezone: "Z",
  entities: [],
  migrations: ["src/migrations/**/*.ts"],
  synchronize: false, // Always false in production
  logging: true,
});

export default dataSource;
