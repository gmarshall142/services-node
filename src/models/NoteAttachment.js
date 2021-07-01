import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';

const NoteAttachment = sequelize.define('noteattachments', {
  noteid: { type: Sequelize.INTEGER, allowNull: false },
  attachmentid: { type: Sequelize.INTEGER, allowNull: false }
},
{
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
});

export default NoteAttachment;
