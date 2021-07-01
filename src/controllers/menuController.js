import sequelize from '../database/sequelize';
import QueryTypes from "sequelize";
import Helper from '../modules/helper';

const _ = require('lodash');
const helper = new Helper();

exports.menuFindAll = (req, res) => {
  const permissions = req.user ? helper.formatArray(req.user.userPermissions) : '{}';

  sequelize.query('select * from menusfindall(:permissions);',
    {replacements: { permissions: permissions} }
  )
    .then(response => {
      const data = response[0];
      const menuitems = _.filter(data, (item) => {
        return item.syspath === '/';
      });
      _.forEach(menuitems, (item) => {
        getSubmenus(item, data);
      });
      // replace Applications with its children
      const pos = menuitems.findIndex(it => it.label === 'Applications');
      console.log(`pos: ${pos}`);
      const apps = menuitems[pos].children;
      menuitems.splice(pos, 1);
      apps.forEach((it, idx) => {
        menuitems.splice(pos + idx, 0, it);
      });
      clearEmptyNodes(menuitems);
      res.json(menuitems);
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Find all failed.');
    });
};

function clearEmptyNodes(menuItems) {
  _.remove(menuItems, menu => {
    if(menu.pageid === 0 && menu.children.length === 0) {
      //console.log(`menu: ${menu.label}`);
      return true;
    } else {
      clearEmptyNodes(menu.children);
    }
  })
}

function getSubmenus(menuItem, menuData) {
  const children = [];
  _.forEach(menuItem.subitems, (it) => {
    const childItem = _.find(menuData, (data) => {return data.id === it;});
    if(childItem) {
      getSubmenus(childItem, menuData);
      children.push(childItem);
    }
  });
  menuItem.children = _.sortBy(children, (child) => { return child.itemposition; });
  menuItem.routingPath = getRoutingPath(menuItem);
}

function getRoutingPath(item) {
  const routerPath = (item.routerpath ? item.routerpath : item.label);
  if (item.syspath === '/' || item.syspath === '/Administration') {
    return `/${routerPath.toLowerCase()}`;
    // } else if (item.syspath === '/Administration/task') {
    //   // TODO: replace hard coded 'Administration' to a map of system submenus
    //   return `${item.pathname.toLowerCase()}`;
  } else {
    return `/apps/${routerPath.toLowerCase()}`;
  }
}

exports.menuBulkAdd = (req, res) => {
  const nodes = helper.convertJsonArray(req.body);

  sequelize.query('select * from menuBulkAdd(:nodes);',
    {replacements:  {nodes: nodes}, type: QueryTypes.SELECT}
  )
    .then(response => {
      const ret = response[0][0].menubulkadd;
      res.json({records: ret});
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Menu bulk add failed.');
    });
};

exports.menuBulkUpdate = (req, res) => {
  const nodes = helper.convertJsonArray(req.body);

  sequelize.query('select * from menuBulkUpdate(:nodes);',
    {replacements:  {nodes: nodes}, type: QueryTypes.SELECT}
  )
    .then(response => {
      const ret = response[0][0].menubulkupdate;
      res.json({records: ret});
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Menu bulk update failed.');
    });
};

exports.menuBulkDelete = (req, res) => {
  const nodes = helper.convertJsonArray(req.body);

  sequelize.query('select * from menuBulkDelete(:nodes);',
    {replacements:  {nodes: nodes}, type: QueryTypes.SELECT}
  )
    .then(response => {
      const ret = response[0][0].menubulkdelete;
      res.json({records: ret});
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Menu bulk delete failed.');
    });
};

exports.menuAdd = (req, res) => {
  const item = helper.convertJsonObject(req.body);

  sequelize.query('select * from menuitemAdd(:item);',
    {replacements:  {item: item}, type: QueryTypes.SELECT}
  )
    .then(response => {
      const ret = response[0][0].menuitemadd;
      res.json({id: ret});
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Menu add failed.');
    });
};

