import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';

const Quote = sequelize.define('quotes', {
  author_first_name: { type: Sequelize.STRING, allowNull: true },
  author_last_name: { type: Sequelize.STRING, allowNull: true },
  quote_string: { type: Sequelize.STRING, allowNull: false },
  jsondata: { type: Sequelize.JSON, allowNull: true },
  version: { type: Sequelize.INTEGER, defaultValue: 1 },
  categoryid: { type: Sequelize.INTEGER, defaultValue: null },
  formatid: { type: Sequelize.INTEGER },
},
{
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
});

export default Quote;
