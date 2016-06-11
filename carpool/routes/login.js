var mysql=require('./mysqlconnect')
var tool=require('./utility')
exports.showprofile=function(userid,callback){
  var sql='select * from users where UserID='+tool.bag(userid)+';'
  mysql.query(sql,callback)
}
exports.insertPic=function(userid,picpath,callback)
{
  var sql='delete from userPic where UserID='+tool.bag(userid)+';'
  mysql.query(sql,function(qerr,vals,fields){
    var sql='insert into userPic values('+tool.bag(userid)+','+tool.bag(picpath)+');'
    mysql.query(sql,callback)
  })
}
exports.getPic=function(UserID,callback){
  var sql='select Pics from userPic where UserID='+tool.bag(UserID)+';'
  mysql.query(sql,function(qerr,vals,fields){
    if(vals.length>0)callback(vals[0].Pics)
    else callback('default.png')
  })
}
exports.checkifin=function(userid,password,callback){
  mysql.query("select Password from users where UserID='"+userid+"';",function(qerr,vals,fields){

    if (vals.length>0) {
      if (vals[0].Password==password){
        callback('Success')
      }else callback('PasswordError')
    }else {
      callback('UserError')
    }
  })
}

var bag=function(input){
  return "'"+input+"'"
}

exports.registe=function(userid,password,gender,detail,callback){
  exports.checkifin(userid,password,function(val){
    console.log(val);
    if (val=='Success'){//there exists a user
      callback('UserExists')
    }else {
      if (val=='UserError'){//can be registed
        mysql.query('insert into users values('+bag(userid)+','+bag(password)+','+bag(gender[0])+','+bag(detail)+',null'+');',function(qerr,vals,fields){
          callback(vals)
        })
      } else{
        callback('UserExists')
      }
    }
  })
}
