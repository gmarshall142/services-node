import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';
import NoteTopic from "./NoteTopic";

const Note = sequelize.define('notes', {
  topicid: { type: Sequelize.INTEGER, allowNull: false },
  comment: { type: Sequelize.STRING, allowNull: true },
  notetext: { type: Sequelize.STRING, allowNull: false },
  jsondata: { type: Sequelize.JSON, allowNull: true }
},
{
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
});

Note.belongsTo(NoteTopic, {foreignKey: 'topicid'});
NoteTopic.hasMany(Note, {foreignKey: 'topicid'});

export default Note;
