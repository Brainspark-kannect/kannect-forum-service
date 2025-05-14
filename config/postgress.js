const { Pool } = require("pg");

const pool = new Pool({
  user: "admin",
  host: "dpg-d0a1571r0fns73e0melg-a.singapore-postgres.render.com",
  database: "kannectdb",
  password: "pAdo1Zeme66SHatZmtFnpF9CFklo2Ugx",
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // ✅ critical for Render PostgreSQL
  },
});

pool
  .connect()
  .then(() => console.log("PostgreSQL Connected ✅"))
  .catch((err) => console.error("PostgreSQL Connection Error ❌", err));

module.exports = pool;
