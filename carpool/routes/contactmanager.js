var tool=require('./utility')
var mysql=require('./mysqlconnect')
exports.join_contact=function(UserID,GroupID,callback)
{
  var sql="insert into join_contact values("+tool.bag(GroupID)+','+tool.bag(UserID)+');'
  mysql.query(sql,function(qerr,vals,fields){
    if (!qerr&&callback)callback('success')
  })
}
exports.begin_contact=function(GroupID,description,callback){
  var sql='insert into contact values('+tool.bag(GroupID)+','+tool.bag(description)+');'
  mysql.query(sql,function(qerr,vals,fields){
    if (!qerr&&callback)callback('success')
  })
}
exports.exit_contact=function(UserID,GroupID,callback){
  var sql='delete from join_contact where UserID='+tool.bag(UserID)+' and GroupID='+tool.bag(GroupID)+';'
  mysql.query(sql,function(qerr,vals,fields){
    if (!qerr&&callback) callback('success')
  })
}
exports.show_all_contact=function(UserID,callback){
  var sql='select * from join_contact natural join contact where UserID='+tool.bag(UserID)+';'
  mysql.query(sql,function(qerr,vals,fields){
    callback(qerr,vals,fields)
  })
}
