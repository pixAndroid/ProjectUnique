const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Enquiry = sequelize.define('Enquiry', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, defaultValue: '' },
  email: { type: DataTypes.STRING, defaultValue: '' },
  serviceRequired: { type: DataTypes.STRING, defaultValue: '' },
  message: { type: DataTypes.TEXT, defaultValue: '' },
  status: {
    type: DataTypes.ENUM('new', 'read', 'replied'),
    defaultValue: 'new'
  }
}, {
  tableName: 'enquiries',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = Enquiry;

