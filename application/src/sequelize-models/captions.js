module.exports = (sequelize, Sequelize) => {
  const caption = sequelize.define("caption", {
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
    total_number_of_rates: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: true,
    },
    consensus: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    dataset_name: {
      type: Sequelize.STRING(45),
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
