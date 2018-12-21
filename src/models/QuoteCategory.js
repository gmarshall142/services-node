import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';

const QuoteCategory = sequelize.define('quotecategories', {
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: true }
},
{
  timestamps: false
});

export default QuoteCategory;
