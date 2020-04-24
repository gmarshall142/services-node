const _ = require('lodash');

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
}

