import Sequelize from 'sequelize';

// const sequelize = new Sequelize('gmarshall', 'gmarshall', 'P@ssw0rd',
//   {
//     host: 'localhost',
//     dialect: 'postgres',
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   });
//
// export default sequelize;

console.log(`GEMAPPS_POSTGRES_NAME: ${process.env.GEMAPPS_POSTGRES_NAME}`);
console.log(`GEMAPPS_POSTGRES_USER: ${process.env.GEMAPPS_POSTGRES_USER}`);
console.log(`GEMAPPS_POSTGRES_PSWD: ${process.env.GEMAPPS_POSTGRES_PSWD}`);
console.log(`POSTGRES_HOST: ${process.env.POSTGRES_HOST}`);
console.log(`POSTGRES_PORT: ${process.env.POSTGRES_PORT}`);

const sequelize = new Sequelize(process.env.GEMAPPS_POSTGRES_NAME, process.env.GEMAPPS_POSTGRES_USER, process.env.GEMAPPS_POSTGRES_PSWD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

export default sequelize;
