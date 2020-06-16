module.exports = (sequelize, Sequelize) => {
    const Version = sequelize.define("version", {
      original: {
        type: Sequelize.STRING
      },
      thumb: {
        type: Sequelize.STRING
      },
      large: {
        type: Sequelize.STRING
      },
      verid: {
        type: Sequelize.STRING 
      }

    });
    return Version;
  };