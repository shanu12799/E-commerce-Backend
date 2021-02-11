var mysql=require('mysql');
var pool=mysql.createPool({
  host:'localhost',
  // host:'sql7.freemysqlhosting.net',
  port:'3307',
  // port:'3306',
  user:'root',
  // user:'sql7348951',
  password:'123',
  // password:'RSYcg4Ghi3',
  database:'onlinestore',
  // database:"sql7348951",
  connectionLimit:100,
  multipleStatements:true
});

module.exports=pool;