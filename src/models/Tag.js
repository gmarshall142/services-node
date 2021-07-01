import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';

const Tag = sequelize.define('tags', {
  name: { type: Sequelize.STRING, allowNull: true },
},
{
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
});

export default Tag;
