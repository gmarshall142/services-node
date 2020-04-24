import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';
import Note from "./Note";

const NoteTopic = sequelize.define('topics', {
  name: { type: Sequelize.STRING, allowNull: false },
  parentid: { type: Sequelize.INTEGER, allowNull: true }
},
{
  timestamps: false
});

NoteTopic.belongsTo(NoteTopic, {foreignKey: 'parentid'});
// NoteTopic.hasMany(Note, {foreignKey: 'topicid'});

export default NoteTopic;
