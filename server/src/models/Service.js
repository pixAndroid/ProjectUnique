const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Service = sequelize.define('Service', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  image: { type: DataTypes.TEXT, defaultValue: '' },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  shortDescription: { type: DataTypes.TEXT, defaultValue: '' },
  metaTitle: { type: DataTypes.STRING, defaultValue: '' },
  metaDescription: { type: DataTypes.TEXT, defaultValue: '' },
  clickCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'services',
  timestamps: true
});

module.exports = Service;

