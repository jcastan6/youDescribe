/* eslint-disable arrow-parens */
/* eslint-disable quotes */
const bcrypt = require("bcrypt");
const { default: main } = require("mysqldump");

module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(45),
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING(45),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal("NOW()"),
    },
    total_score: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    tutorial_images: {
      type: Sequelize.INTEGER,
      defaultValue: 10,
    },
    probation_images: {
      type: Sequelize.INTEGER,
      defaultValue: 20,
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    total_num_attempts: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    total_num_success: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal("NOW()"),
    },
  });

  return user;
};
