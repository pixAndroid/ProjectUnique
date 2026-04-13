const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Analytics = sequelize.define('Analytics', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
  type: {
    type: DataTypes.ENUM('pageview', 'click', 'service_view', 'product_view'),
    allowNull: false
  },
  page: { type: DataTypes.STRING, defaultValue: '' },
  referenceId: { type: DataTypes.STRING, defaultValue: '' },
  referenceType: { type: DataTypes.STRING, defaultValue: '' },
  ip: { type: DataTypes.STRING, defaultValue: '' },
  userAgent: { type: DataTypes.TEXT, defaultValue: '' },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'analytics',
  timestamps: false
});

module.exports = Analytics;

