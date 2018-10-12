const _ = require('lodash');

export default class Helper {

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
}

