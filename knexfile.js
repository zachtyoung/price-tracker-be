// Update with your config settings.
require('dotenv').config()
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/products.db3',
    },
    useNullAsDefault: true,
    // generates migration files in a data/migrations/ folder
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
        directory: __dirname + '/db/migrations',
    },
    seeds: {
        directory: __dirname + '/db/seeds/production',
    },
},

};