module.exports = (sequelize, Sequelize) => {
  const caption = sequelize.define("probation-caption", {
    cap_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    caption: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    images_img_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    ratings: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    consensus: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal("NOW()"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal("NOW()"),
    },
  });

  return caption;
};
