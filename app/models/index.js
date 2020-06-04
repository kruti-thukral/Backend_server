const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: dbConfig.port,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.project = require("./project.model.js")(sequelize, Sequelize);
db.floorplan = require("./floorplan.model.js")(sequelize, Sequelize);

// create a one to many relationship between project and floorplan
db.project.hasMany(db.floorplan, {foreignKey: 'fk_projectid', sourceKey: 'id'});
db.floorplan.belongsTo(db.project, {foreignKey: 'fk_projectid', targetKey: 'id'});

module.exports = db;