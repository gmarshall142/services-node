// import sequelize from '../database/sequelize';
// import QueryTypes from "sequelize";
import Helper from '../modules/helper';
import Tag from '../models/Tag';

const _ = require('lodash');
const helper = new Helper();

exports.tagsFindAll = (req, res) => {
  return helper.tableFindAll(req, res, Tag, { order: [['name', 'ASC']] }, 'tags');
};

exports.insertTag = (body) => {
  return new Promise((resolve, reject) => {
    Tag
      .build(body)
      .save()
      .then(results => {
        resolve(results.dataValues);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};

