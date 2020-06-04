module.exports = (sequelize, Sequelize) => {
    const Floorplan = sequelize.define("floorplan", {
      name: {
        type: Sequelize.STRING
      },
      original: {
        type: Sequelize.STRING
      },
      thumb: {
        type: Sequelize.STRING
      },
      large: {
        type: Sequelize.STRING
      }

    });
    return Floorplan;
  };