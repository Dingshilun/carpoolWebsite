var mysql=require('./mysqlconnect')
var tool=require('./utility')
exports.addfriend=function(UserID1,UserID2,callback)
{
  var sql='insert into friends values('+tool.bag(UserID1)+','+tool.bag(UserID2)+');'
  mysql.query(sql,function(qerr,vals,fields){
    if (!qerr){
      callback('success')
    }
  })
}

exports.deletefriend=function(UserID1,UserID2,callback){
  var sql='delete from friends where UserID1='+tool.bag(UserID1)+' and UserID2='+tool.bag(UserID2)+';'
  mysql.query(sql,function(qerr,vals,fields){
    if (!qerr){
      callback('success')
    }
  })
}
//callback(vals,success)
exports.showAllfriends=function(UserID,callback)
{
  var sql='select * from friends where UserID1='+tool.bag(UserID)+';'
  mysql.query(sql,function(qerr,vals,fields){
    if (!qerr){
      callback(vals,'success')
    }
  })
}
