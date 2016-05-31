var mysql = require('mysql')
var pool = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'',
  database:'carpool'
})

exports.query=function(sql,callback){
  console.log(sql);
  pool.getConnection(function(err,conn){
    if (err){
      callback(err,null,null)
    } else{
      conn.query(sql,function(qerr,vals,fields){
        conn.release();
        if (callback!=null)
          callback(qerr,vals,fields)
      })
    }
  })
}
