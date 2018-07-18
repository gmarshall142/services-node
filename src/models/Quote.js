import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';

const Quote = sequelize.define('quotes', {
  version: { type: Sequelize.INTEGER, defaultValue: 0 },
  author_first_name: { type: Sequelize.STRING, allowNull: true },
  author_last_name: { type: Sequelize.STRING, allowNull: true },
  last_updated: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  quote_string: { type: Sequelize.STRING, allowNull: false },
  json_attributes: { type: Sequelize.JSON, allowNull: true },
},
{
  timestamps: false
});

export default Quote;
