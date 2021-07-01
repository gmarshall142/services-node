//import sequelize from '../database/sequelize';
import Note from "../models/Note";
import NoteTopic from '../models/NoteTopic';
import masterController from './masterController';
import Helper from '../modules/helper';
import NoteAttachment from "../models/NoteAttachment";
import Attachment from "../models/Attachment";
import FileController from './fileController';

const helper = new Helper();
const fileController = new FileController();
const _ = require('lodash');

exports.noteTopicsFindAll = (req, res) => {
  helper.tableFindAll(req, res, NoteTopic, {
    order: [['name', 'ASC']],
    include: [
      { model: NoteTopic, attributes: ['name', 'parentid'] }
    ]
  }, 'topics');
};

exports.noteTopicsFind = (req, res) => {
  helper.tableFind(res, NoteTopic, req.params.topicId, 'topics')
};

exports.noteTopicsAdd = (req, res) => {
  helper.tableAdd(req, res, NoteTopic, 'topics');
};

exports.notesFindAll = (req, res) => {
  const config = {
    order: [['id', 'ASC']],
    include: [
      { model: NoteTopic },
      { model: NoteAttachment, include: [{ model: Attachment }] }
    ]
  };
  // TODO: change to return results and walk results to add links
  // helper.tableFindAll(req, res, Note, config, 'notes')
  Note.findAll(config)
    .then(response => {
      // res.json(response);
      const resp = [];
      _.forEach(response, (note) => {
        const newNote = _.cloneDeep(note);
        _.forEach(newNote.noteattachments, it => {
          it.attachment.dataValues.links = fileController.getAttachmentLink(it.attachment);
        });
        resp.push(newNote);
      });
      res.json(resp);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send('Find all Notes failed.');
    });
};

exports.notesFind = (req, res) => {
  helper.tableFindPromise(
    Note,
    {
      where: {id: req.params.noteId},
      include: [
        { model: NoteTopic, attributes: ['name', 'parentid'] },
      ],
    }
  )
    .then(response => {
      res.json(parseAttributes(response));
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Find failed.');
    });
};

/*
{
  where: {appid: appid},
  include: [
    {
      model: Column,
      attributes: ['id', 'columnname', 'label', 'datatypeid', 'mastertable', 'apptableid'],
      where: {
        columnname: {
          [Op.and]: [
            {[Op.ne]: 'apptableid'},
            {[Op.ne]: 'jsondata'}
          ]
        }
      },
      include: [
        { model: DataType, attributes: ['name'] }
      ],
      order: ['label', 'ASC']
    }
  ]
})
*/

exports.notesAdd = async (req, res) => {
  // const transaction = await sequelize.transaction();
  let addFiles = [];
  let newNote = undefined;
  let note = undefined;
  const processFile = (name, file) => {
    console.log(`********** name: ${name} file: ${JSON.stringify(file)}`);
    addFiles.push(file);
  };
  const processField = async (name, val) => {
    newNote = JSON.parse(val);
    console.log(`********** field: ${name}: ${JSON.stringify(newNote)}`);
  };
  const processEnd = async (res) => {
    if (!newNote.notetext) {
      res.status(400).send('Note is required');
    } else {
      try {
        const topicid = await checkTopic(newNote);
        const obj = await relatedObjects(newNote);
        const resp = await Note
          .create( {
            notetext: newNote.notetext,
            comment: newNote.comment,
            topicid: topicid,
            jsondata: createAttributes(newNote),
            tags: obj.tags ? obj.tags : [],
            // attachments: obj.attachments ? obj.attachments : [],
            createdat: Date.now()
          });
        note = resp.dataValues;
        console.log(`addFiles: ${JSON.stringify(addFiles)}`);
        for(const it of addFiles) {
          console.log(`file: ${JSON.stringify(it)}`);
          // add attachments record
          const attachment = await Attachment.create({
            path: '/notes',
            uniquename: it.uniqueName,
            name: it.name,
            size: it.size,
            createdat: Date.now()
          });
          // add noteattachments record
          await NoteAttachment.create({
            noteid: note.id,
            attachmentid: attachment.id,
            createdat: Date.now()
          });
        }
        // await transaction.commit();
        res.json(note);
        // await transaction.rollback();
        // res.status(400).send('Add failed.');
      } catch(error) {
        console.error(error);
        // await transaction.rollback();
        res.status(400).send('Add failed.');
      }
    }
  };

  const funcs = {
    file: processFile,
    field: processField,
    end: processEnd
  };
  helper.processForm(req, res, 'notes', funcs);
};

// function processFile(name, file) {
//   console.log(`********** file: ${file.path}`);
// }

// function processFieldAdd(name, val) {
//   console.log(`********** field: ${name}: ${JSON.stringify(val)}`);
// }

// function processEnd(res) {
//   res.status(200);
//   res.send(`add complete.`);
// }

exports.notesUpdate = async (req, res) => {
  // const note = req.body;
  // note.topicid = await checkTopic(req.body);
  // note.jsondata = createAttributes(req.body);
  // const obj = await relatedObjects(req.body);
  // if(obj.tags) note.tags = obj.tags;
  // if(obj.attachments) note.attachments = obj.attachments;
  //
  // Note.update(
  //   note,
  //   {
  //     where: {id: req.params.noteId},
  //     returning: true,
  //     plain: true
  //   })
  //   .then(results => {
  //     res.json(parseAttributes(results[1].dataValues));
  //   })
  //   .catch(error => {
  //     console.error(error);
  //     res.status(400);
  //     res.send('Update failed.');
  //   });
  res.send('updated');
};

exports.notesDelete = (req, res) => {
  helper.tableDelete(req, res, Note, req.params.noteId, 'Note');
};

function createAttributes(payload) {
  // return {
  //   "tags": payload.tags,
  //   "attachments": payload.attachments
  // };
  return {};
}

function parseAttributes(note) {
  note.tags = note.jsondata.tags;
  note.attachments = note.jsondata.attachments;
  delete note.jsondata;
  return note;
}

async function checkTopic(body) {
  if(body.topicid) {
    return body.topicid;
  } else if(body.topic) {
    return body.topic.id;
  }

  try {
    const topic = await NoteTopic.build(body.topicRecord).save();
    return topic.id;
  } catch(error) {
    console.error(error);
    return undefined;
  }
}

async function relatedObjects(body) {
  const retObj = { tags: undefined, attachements: undefined };
  if(body.tagModel) {
    retObj.tags = [];
    const newTags = [];
    _.forEach(body.tagModel, it => {
      if(typeof(it) === 'object') {
        retObj.tags.push(it.id);
      } else if(typeof(it) === 'string') {
        newTags.push(it);
      }
    });
    if(newTags.length > 0) {
      const promises = [];
      _.forEach(newTags, it => {
        promises.push(masterController.insertTag({ name: it, createdat: Date.now() }));
      });
      try {
        const responses = await Promise.all(promises);
        _.forEach(responses, it => retObj.tags.push(it.id));
      } catch (err) {
        console.log(err);
      }
    }
  } // tagModel
  return retObj;
}

// exports.quoteFind = (req, res) => {
//   //Quote.findById(req.params.quoteId)
//   sequelize.query(
//     'select * from quotesFindById(:id);',
//     {replacements: {id: req.params.quoteId}, type: sequelize.QueryTypes.SELECT}
//   )
//     .then(response => {
//       res.json(response[0]);
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(400);
//       res.send('Find failed.');
//     });
// };
//
// exports.quoteAdd = (req, res) => {
//   if (!req.body.quote_string) {
//     res.status(400);
//     res.send('Quote is required');
//   } else {
//     const categoryid = (req.body.categoryid === 0 ? null : req.body.categoryid);
//     Quote
//       .build( {
//         version: req.body.version,
//         author_first_name: req.body.author_first_name,
//         author_last_name: req.body.author_last_name,
//         quote_string: req.body.quote_string,
//         categoryid: categoryid,
//         formatid: req.body.formatid,
//         jsondata: createAttributes(req.body),
//         createdat: Date.now()
//       })
//       .save()
//       .then(quote => {
//         res.json(parseAttributes(quote.dataValues));
//       })
//       .catch(error => {
//         console.error(error);
//         res.status(400);
//         res.send('Add failed.');
//       });
//   }
// };
//
// function createAttributes(payload) {
//   return {
//     "comment": payload.comment,
//     "graphic_url": payload.graphic_url,
//     "source": payload.source
//   };
// }
//
// function parseAttributes(quote) {
//   quote.comment = quote.jsondata.comment;
//   quote.graphic_url = quote.jsondata.graphic_url;
//   quote.source = quote.jsondata.source;
//   delete quote.jsondata;
//   return quote;
// }
//
// exports.quoteUpdate = (req, res) => {
//   const quote = req.body;
//   quote.jsondata = createAttributes(req.body);
//   Quote.update(
//     req.body,
//     {
//       where: {id: req.params.quoteId},
//       returning: true,
//       plain: true
//     })
//     .then(results => {
//       res.json(parseAttributes(results[1].dataValues));
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(400);
//       res.send('Update failed.');
//     });
// };
//
// exports.quoteDelete = (req, res) => {
//   const quoteId = req.params.quoteId;
//   Quote.destroy({
//     where: { id: req.params.quoteId }
//   })
//   .then(deletedRecord => {
//     console.log(`deleted: ${deletedRecord}`);
//     if (!deletedRecord) {
//       res.status(400);
//       res.send('Delete failed.');
//     } else {
//       res.json({ deleted: deletedRecord, id: quoteId});
//     }
//   });
// };
//
// // ===== FORMAT ===============================
// exports.formatFindAll = (req, res) => {
//   helper.tableFindAll(req, res, QuoteFormat, { order: [['name', 'ASC']] }, 'quote formats');
// };
//
// // ===== CATEGORIES ===============================
// exports.categoryFindAll = (req, res) => {
//   helper.tableFindAll(req, res, QuoteCategory, { order: [['name', 'ASC']] }, 'quote categories');
// };
//
