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
    join_contact[vals[GroupID].GroupID]=new Array()
    }
  })
}
exports.oncallback=function(socket){
  console.log('new connection=======================');
  console.log(join_contact);
  socket.on('userinfo',function(info){
    console.log('==============User:',info);
    info=JSON.parse(info)
    socketMap[info[0].UserID]=socket
    var sql='select GroupID from join_contact where UserID='+tool.bag(info[0].UserID)+';'
    mysql.query(sql,function(qerr,vals,fields){
      for (i in vals){
        join_contact[vals[i].GroupID].push(info[0].UserID)
      }
    })
    //console.log(socketMap);
  })//传递用户过来
  socket.on('message',function(message){
    console.log(message);
    message=JSON.parse(message)
    var GroupID=message[0].GroupID
    var content=message[0].Content
    var User=message[0].UserID
    var Send_date=new Date()
    message[0].Send_date=Send_date
    console.log(">>>>>>>>>>>>>>>join_contact>>>>>>>>",join_contact);
    var sql='insert into contact_content values('+tool.bag(GroupID)+','+tool.bag(User)+','+tool.bag(content)+','+tool.bag(Send_date)+');'
    mysql.query(sql,function(qerr,vals,fields){
      for (i in join_contact[GroupID]){
        console.log(i);
        var user=join_contact[GroupID][i]
        console.log('===========send message?',user);
        if (socketMap[user]) {
          console.log('send message to',user,message[0].content);
          socketMap[user].emit('message_from_server',JSON.stringify(message))}
      }//广播信息
    })
  })//发消息，发到聊天group，两个人可以建一个只有两个人的group
  /****客户端请求聊天记录*****/
  socket.on('get_content_from_server',function(message){
    var GroupID=message['GroupID']
    var User=message['User']
    var sql='select * from contact_content where GroupID='+tool.bag(GroupID)+' order by Send_date limit 20;'
    mysql.query(sql,function(qerr,vals,fields){
      socketMap[User].emit('message_from_server',JSON.stringify(vals))
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
