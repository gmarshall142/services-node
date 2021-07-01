import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';
import NoteTopic from "./NoteTopic";
import NoteAttachment from "./NoteAttachment";

const Note = sequelize.define('notes', {
  topicid: { type: Sequelize.INTEGER, allowNull: false },
  comment: { type: Sequelize.STRING, allowNull: true },
  notetext: { type: Sequelize.STRING, allowNull: false },
  jsondata: { type: Sequelize.JSON, allowNull: true },
  tags: { type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: false }
},
{
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
});

Note.belongsTo(NoteTopic, {foreignKey: 'topicid'});
NoteTopic.hasMany(Note, {foreignKey: 'topicid'});
NoteAttachment.belongsTo(Note, {foreignKey: 'noteid'});
Note.hasMany(NoteAttachment, {foreignKey: 'noteid'});

export default Note;
