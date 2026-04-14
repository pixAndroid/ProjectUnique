const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    // e.g. 'new_enquiry' | 'blog_published' | 'blog_edited' | 'milestone_view' | 'milestone_click'
  },
  message: { type: DataTypes.STRING, allowNull: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
  meta: { type: DataTypes.JSONB, defaultValue: {} }
}, {
  tableName: 'notifications',
  timestamps: true,
  updatedAt: false
});

module.exports = Notification;
