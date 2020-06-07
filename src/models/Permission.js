import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';

const Permission = sequelize.define('permissions', {
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: true }
},
{
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
});

export default Permission;
