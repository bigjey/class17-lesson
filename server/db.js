var mysql = require('mysql');
const { promisify } = require('util');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'adminadmin',
  database: 'class17_db'
});

db.queryPromise = promisify(db.query);

module.exports = db;
