import sequelize from "../database/sequelize";
import Attachment from "../models/Attachment";
import Helper from '../modules/helper';

const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const helper = new Helper();

const __volumename = `${process.env.GEMAPPS_VOLUME_PATH}/files`;
console.log(`********** volumes: ${process.env.GEMAPPS_VOLUME_PATH}`);
// const __uploadsdir = 'uploads';
const __attachmentsdir = 'attachments';

class FileController {

  uploadFiles = (req, res) => {
    const uuid = uuidv1();
    const form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', (name, file) => {
      file.uniqueName = `${uuid}_${file.name}`;
      file.path = `${__volumename}/${__attachmentsdir}/${file.uniqueName}`;
    });

    form.on('file', (name, file) => {
      console.log(`file: ${file.path}`);
      // add attachments and userattachments records
      // sequelize.query(
      //   'select * from app.attachmentAddUpload(:userid, :path, :uniquename, :name, :size);',
      //   {
      //     replacements: {
      //       userid: user.id,
      //       path: `/${__uploadsdir}`,
      //       uniquename: file.uniqueName,
      //       name: file.name,
      //       size: file.size
      //     },
      //     type: sequelize.QueryTypes.SELECT
      //   }
      // )
      //   .then((resp) => {
      //     res.status(200);
      //     res.send(`upload: ${file.uniqueName}`);
          // res.json(
          //   {
          //     // url: encodeURI(`http://${__host}:${__port}/files/temp/${file.uniqueName}`),
          //     url: encodeURI(`${helper.getServerUrl()}/files/temp/${file.uniqueName}`),
          //     name: file.name,
          //     size: file.size,
          //     uniqueName: file.uniqueName
          //   }
          // );
      //   })
      //   .catch(error => {
      //     logger.error(error);
      //     res.status(400);
      //     res.send('Add attachment failed.');
      //   });

    });

    form.on('field', (name, val) => {
      console.log(`${name}: ${JSON.stringify(val)}`);
    });

    form.on('end', () => {
      res.status(200);
      res.send(`upload complete.`);
    });

    console.log('returning');
  };

  // deleteTempFile = (req, res) => {
  //   const user = helper.checkUser(req, res);
  //   if(!user) return;
  //
  //   const path = `${__volumename}/${__uploadsdir}/${req.params.fileName}`;
  //   try {
  //     fs.unlinkSync(path);
  //   } catch(error) {
  //     logger.error(error);
  //     res.status(404).send(error);
  //     return;
  //   }
  //
  //   const uniqueName = decodeURI(req.params.fileName);
  //   sequelize.query(
  //     'select * from app.attachmentDeleteUpload(:uniquename);',
  //     {
  //       replacements: {
  //         uniquename: uniqueName,
  //       },
  //       type: sequelize.QueryTypes.SELECT
  //     }
  //   )
  //     .then((resp) => {
  //       res.status(200);
  //       res.send('Attachment removed.');
  //     })
  //     .catch(error => {
  //       logger.error(error);
  //       res.status(500).send(error);
  //     });
  // };

  // getUserAttachments = (req, res) => {
  //   // const userId = (req.user ? req.user.id : undefined);
  //   // logger.log(`getUserAttachments userId: ${userId}`);
  //   const user = helper.checkUser(req, res);
  //   if(!user) return;
  //
  //   UserAttachment.findAll({
  //     where: {userid: user.id},
  //     include: [
  //       {
  //         model: Attachment
  //       }
  //     ]
  //   })
  //     .then(response => {
  //       _.forEach(response, (it) => {
  //         it.attachment.dataValues.url = `${helper.getServerUrl()}/files/temp/${it.attachment.uniquename}`;
  //       });
  //       res.json(response);
  //     })
  //     .catch(error => {
  //       logger.error(error);
  //       res.status(400);
  //       res.send('User attachments fetch failed.');
  //     });
  // };

  // downloadTempFile = (req, res) => {
  //   const user = helper.checkUser(req, res);
  //   if(!user) return;
  //
  //   const fileName = req.params.fileName;
  //   const path = `${__volumename}/${__uploadsdir}/${fileName}`;
  //   logger.log(path);
  //   const file = fileName.replace(/^.{8}-.{4}-.{4}-.{4}-.{12}_/, '');
  //   res.download(path, file);
  // };

  downloadFile = (req, res) => {
    const filePath = req.params.fileName;
    const path = `${__volumename}/attachments/${req.params.appId}/${filePath}`;
    console.log(path);
    const file = filePath.replace(/^.{8}-.{4}-.{4}-.{4}-.{12}_/, '');
    res.download(path, file);
  };

  // updateAttachments = (userId, tbl, recordId, attachments) => {
  //   console.log('=====================================');
  //   console.log(`userId: ${userId}  appId: ${tbl.appid}  appTableId: ${tbl.apptableid}`);
  //   console.log('=====================================');
  //
  //   return new Promise((resolve, reject) => {
  //     const functionCalls = [];
  //     const dirPath = `${__volumename}/${__attachmentsdir}/${tbl.appid.toString()}`;
  //     helper.checkDirPath(dirPath);
  //
  //     _.forEach(attachments, (it) => {
  //       const oldPath = `${__volumename}/${__uploadsdir}/${it.data.uniqueName}`;
  //       fs.copyFileSync(oldPath, `${dirPath}/${it.data.uniqueName}`);
  //       fs.unlinkSync(oldPath);
  //
  //       functionCalls.push(
  //         sequelize.query(
  //           'select * from app.attachmentUpdate(:userid, :uniquename, :location, :apptableid, :tablerecordid);',
  //           {
  //             replacements: {
  //               userid: userId,
  //               uniquename: it.data.uniqueName,
  //               location: `/${__attachmentsdir}/${tbl.appid.toString()}`,
  //               apptableid: tbl.apptableid,
  //               tablerecordid: recordId
  //             },
  //             type: sequelize.QueryTypes.SELECT
  //           }
  //         )
  //       );
  //     });
  //
  //     sequelize.Promise.all(functionCalls)
  //       .then(responses => {
  //         logger.log('attachment updates completed');
  //         resolve();
  //       })
  //       .catch(error => {
  //         logger.error(e);
  //         reject(e);
  //       });
  //   });
  // };

  // attachFiles = (tableId, recordId, attachments) => {
  //   console.log('=====================================');
  //   console.log(`tableId: ${tableId}  recordId: ${recordId}`);
  //   console.log('=====================================');
  //   return new Promise((resolve, reject) => {
  //     const functionCalls = [];
  //
  //     _.forEach(attachments, (it) => {
  //       functionCalls.push(
  //         sequelize.query(
  //           'select * from app.attachmentAddLink(:uniquename, :apptableid, :tablerecordid);',
  //           {
  //             replacements: {
  //               uniquename: it.data.uniqueName,
  //               apptableid: tableId,
  //               tablerecordid: recordId
  //             },
  //             type: sequelize.QueryTypes.SELECT
  //           }
  //         )
  //       );
  //     });
  //
  //     sequelize.Promise.all(functionCalls)
  //       .then(responses => {
  //         logger.log('attachment links completed');
  //         resolve();
  //       })
  //       .catch(error => {
  //         logger.error(e);
  //         reject(e);
  //       });
  //   });
  // };

  getAttachmentLink = (attachment) => {
    const links =[
      {
        // TODO: resolve name of application
        href: encodeURI(`${helper.getServerUrl()}/files${attachment.path}/${attachment.uniquename}`),
        rel: 'attachments',
        type: 'GET'
      }
    ];
    return links;
  };
}

export default FileController;
