module.exports = (sequelize, Sequelize) => {
    const Floorplan = sequelize.define("floorplan", {
      name: {
        type: Sequelize.STRING
      }
    });
    return Floorplan;
  };