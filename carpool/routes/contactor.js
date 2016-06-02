//var app = require('express')();
//var http = require('http').Server(app);
var io=require('socket.io')
var socketMap=new Array();
var mysql=require('./mysqlconnect')
var tool=require('./utility')
var join_contact=new Array();
var friendsmanager=require('./friendsmanager')
exports.init=function(){
  var sql='select GroupID from contact;'

  mysql.query(sql,function(qerr,vals,fields){
    for (GroupID in vals){
      var sql='select GroupID,UserID from join_contact where GroupID='+tool.bag(vals[GroupID].GroupID)+';'
      mysql.query(sql,function(qerr,vals2,fields){
        if (vals2)join_contact.push(vals2[0].GroupID,vals2)
      })
    }
  })
}
exports.oncallback=function(socket){
  console.log('new connection=======================');
  socket.on('userinfo',function(info){
    socket[info['user']]=socket
  })//传递用户过来
  socket.on('message',function(message){
    console.log(message);
    var GroupID=message['GroupID']
    var content=message['Content']
    var User=message['user']
    var Send_date=new Date()
    message['Send_date']=Send_date
    var sql='insert into contact_content values('+tool.bag(GroupID)+','+tool.bag(User)+','+tool.bag(content)+','+tool.bag(Send_date)+');'
    mysql.query(sql,function(qerr,vals,fields){
      var send_back_message=[{GroupID:GroupID,Content:content,User:User,Send_date:Send_date}]
      for (i in join_contact[GroupID]){
        var user=join_contact[GroupID][i].UserID
        if (socketMap[user]) socketMap[user].emit('message_from_server',send_back_message)
      }//广播信息
    })
  })//发消息，发到聊天group，两个人可以建一个只有两个人的group
  /****客户端请求聊天记录*****/
  socket.on('get_content_from_server',function(message){
    var GroupID=message['GroupID']
    var User=message['User']
    var sql='select * from contact_content where GroupID='+tool.bag(GroupID)+' order by Send_date limit 20;'
    mysql.query(sql,function(qerr,vals,fields){
      socketMap[User].emit('message_from_server',vals)
    })
  })
  //用户退出
  socket.on('disconnect',function(UserID){
    delete socketMap[UserID]
  })
}

exports.listen=function(){
  return io.listen
}
