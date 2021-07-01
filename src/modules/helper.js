const formidable = require('formidable');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const _ = require('lodash');

const __volumename = `${process.env.GEMAPPS_VOLUME_PATH}/files`;
const __attachmentsdir = 'attachments';

export default class Helper {

  tableAdd = (req, res, table, name) => {
    table
      .build(req.body)
      .save()
      .then(results => {
        res.json(results.dataValues);
      })
      .catch(error => {
        console.error(error);
        res.status(400);
        res.send(`${name} add failed.`);
      });
  };

  tableUpdate = (req, res, table, id, name) => {
    table.update(
      req.body,
      {
        where: {id: id},
        returning: true,
        plain: true
      })
      .then(results => {
        res.json(results[1].dataValues);
      })
      .catch(error => {
        console.error(error);
        res.status(400);
        res.send(`${name} update failed.`);
      });
  };

  tableDelete = (req, res, table, id, name) => {
    const appId = id;
    table.destroy({
      where: { id: appId }
    })
      .then(deletedRecord => {
        if (!deletedRecord) {
          res.status(400);
          res.send(`${name} delete failed.`);
        } else {
          res.json({ deleted: deletedRecord, id: appId});
        }
      })
      .catch(error => {
        console.error(error);
        res.status(400);
        res.send(`${name} delete failed.`);
      });
  };

  tableFindAll = (req, res, table, config, name) => {
    table.findAll(config)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        console.error(error);
        res.status(400);
        res.send(`Find all ${name} failed.`);
      });
  };

  tableFind = (res, table, id, name) => {
    table.findById(id)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        console.error(error);
        res.status(400).send(`Find ${name} failed.`);
      });
  };

  tableFindPromise = (table, config) => {
    return new Promise((resolve, reject) => {
      table.findOne(config)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  };

  convertJsonObject = (obj) => {
    return JSON.stringify(obj);
  };

  convertJsonArray = (arr) => {
    let nodes = '{';

    _.forEach(arr, (node, idx) => {
      const comma = (idx > 0 ? ',' : '');
      const jsonStr = JSON.stringify(node);
      const objectStr = jsonStr.replace(/"/g, '\\"');
      nodes += `${comma} "${objectStr}"`;
    });

    nodes += '}';
    return nodes;
  };

  escapeString = (str) => {
    let tmp;
    tmp = _.escape(str);
    tmp = tmp.replace(/\\/g, '\\\\\\\\');
    tmp = tmp.replace(/\n/g, '\\\\n');
    // let tmp = str.replace(/\n/g, '\\\\n').replace(/\t/g, '\\\\t');
    // return _.escape(tmp);
    return tmp;
  };

  unescapeData = (arr) => {
    _.forEach(arr, obj => this.unescapeObject(obj));
  };

  unescapeObject = (obj) => {
    _.mapKeys(obj, (value, key) => {
      if (typeof value === 'string') {
        obj[key] = this.unescapeString(value);
      }
    });
  };

  unescapeString = (str) => {
    return _.unescape(str);
  };

// const fieldIds = "{ 17, 18, 26, 19, 20, 21, 22, 23, 24, 27 }";
// const fieldVals = "{ null, 4, 3, 1, 1, Submit Custom Form, 2018-09-12 10:33:14.815409, null, 3575, Work to handle form submission }";
  /**
   * Converts array into array formatted for SQL
   *
   * @return String
   */
  formatArray = (arr) => {
    return `{${_.join(arr)}}`;
  };

  checkDirPath(dirPath) {
    try {
      fs.statSync(dirPath).isDirectory();
    } catch (e) {
      if(e.code === 'ENOENT') {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
          if(err) {
            console.error(err);
            throw err;
          }
        });
      } else {
        console.error(e);
        throw e;
      }
    }
  };

  processForm = (req, res, dir, funcs) => {
    const uuid = uuidv1();
    const form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', (name, file) => {
      file.uniqueName = `${uuid}_${file.name}`;
      file.path = `${__volumename}/${__attachmentsdir}/${dir}/${file.uniqueName}`;
    });

    form.on('file', (name, file) => {
      if(funcs.file) {
        funcs.file(name, file);
      }
    });

    form.on('field', (name, val) => {
      if(funcs.field) {
        funcs.field(name, val);
      }
    });

    form.on('end', () => {
      if(funcs.end) {
        funcs.end(res);
      } else {
        res.status(200);
        res.send(`upload complete.`);
      }
    });
  };

  getServerUrl = () => {
    const protocol = process.env.VUE_APP_PROTOCOL ? process.env.VUE_APP_PROTOCOL : 'http';
    const host = process.env.VUE_APP_REST_HOST;
    const port = process.env.VUE_APP_REST_PORT;
    const portStr = !port || port === '' ? '' : `:${port}`;
    const url = `${protocol}://${host}${portStr}`;
    console.debug('====================================');
    console.debug(`url: ${url}   PORT: ${process.env.VUE_APP_REST_PORT}`);
    console.debug('====================================');
    return url;
  };
}

