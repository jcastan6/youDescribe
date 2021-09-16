/* eslint-disable arrow-parens */
/* eslint-disable quotes */
const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const rating = sequelize.define("aiRating", {
    rate_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dispute: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    rate: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    scores: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    consensus: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    confidence: {
      type: Sequelize.STRING(45),
      allowNull: false,
      defaultValue: "Undertermined",
    },
    dispute_desc: {
      type: Sequelize.STRING(260),
      allowNull: true,
    },
    users_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    captions_cap_id: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    success: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
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

  return rating;
};
