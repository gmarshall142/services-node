import Sequelize from 'sequelize';
import sequelize from '../database/sequelize';
import NoteAttachment from "./NoteAttachment";
import Note from "./Note";

const Attachment = sequelize.define('attachments', {
    path: { type: Sequelize.STRING, allowNull: false },
    uniquename: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    size: { type: Sequelize.INTEGER, allowNull: true }
},
{
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
});

NoteAttachment.belongsTo(Attachment, {foreignKey: 'attachmentid'});
Attachment.hasMany(NoteAttachment, {foreignKey: 'attachmentid'});

export default Attachment;
