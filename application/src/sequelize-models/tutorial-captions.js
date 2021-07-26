module.exports = (sequelize, Sequelize) => {
  const caption = sequelize.define("tutorialCaption", {
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
      allowNull: true,
    },
    ratings: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    explanation: {
      type: Sequelize.STRING(250),
      allowNull: false,
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
