import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    dialect: process.env.USE_SQLITE ? "sqlite" : "postgres",
    logging:
      process.env.NODE_ENV === "development" || process.env.ENABLE_DB_LOGGING
        ? console.log
        : false,
    storage: "data/database.sqlite",
  }
);

export default sequelize;
