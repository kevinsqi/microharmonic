// See https://node-postgres.com/guides/project-structure

const { Pool } = require('pg');

// TODO: import this from config/index.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
