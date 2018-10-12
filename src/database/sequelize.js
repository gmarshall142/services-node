import Sequelize from 'sequelize';

const sequelize = new Sequelize('gmarshall', 'gmarshall', 'P@ssw0rd',
  {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

export default sequelize;
