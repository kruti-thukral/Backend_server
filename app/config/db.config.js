module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "123",
    DB: "fieldwire",
    dialect: "postgres",
    port: 5400,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };