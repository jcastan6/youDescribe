module.exports = (sequelize, Sequelize) => {
  const image = sequelize.define("image", {
    img_id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
    },
    img_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    img_url: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
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

  return image;
};
