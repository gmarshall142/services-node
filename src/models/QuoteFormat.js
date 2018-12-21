import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';

const QuoteFormat = sequelize.define('quoteformats', {
  name: { type: Sequelize.STRING, allowNull: false }
},
{
  timestamps: false
});

export default QuoteFormat;
