const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Blog = sequelize.define('Blog', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  image: { type: DataTypes.TEXT, defaultValue: '' },
  content: { type: DataTypes.TEXT, defaultValue: '' },
  excerpt: { type: DataTypes.TEXT, defaultValue: '' },
  tags: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  metaTitle: { type: DataTypes.STRING, defaultValue: '' },
  metaDescription: { type: DataTypes.TEXT, defaultValue: '' },
  published: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'blogs',
  timestamps: true
});

module.exports = Blog;

