import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';
import NoteTopic from "./NoteTopic";

const Note = sequelize.define('notes', {
  comment: { type: Sequelize.STRING, allowNull: true },
  topicid: { type: Sequelize.INTEGER, allowNull: false },
  notetext: { type: Sequelize.STRING, allowNull: false },
  jsondata: { type: Sequelize.JSON, allowNull: true },
  createdat: { type: Sequelize.DATE },
  updatedat: { type: Sequelize.DATE }
},
{
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
});

Note.belongsTo(NoteTopic, {foreignKey: 'topicid'});
NoteTopic.hasMany(Note, {foreignKey: 'topicid'});

export default Note;
