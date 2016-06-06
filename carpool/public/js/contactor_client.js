//定义Zhepin类
var Zhepin = new Object()
var flag=0
Zhepin.socket = null;
Zhepin.init = function() {
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        this.UserID=$('#UserID').text()
        this.GroupID=parseInt($('#GroupID_').attr('content'))
        this.getContent=function(){
          var message=new Object()
          message.User=this.UserID
          message.GroupID=this.GroupID
          message=JSON.stringify(message)
          console.log('get content!');
          this.socket.emit('get_content_from_server',message)
        }
        this.socket.on('connect', function(){
          console.log("connection build");

        })
        this.socket.on('message_from_server',function(vals){
          vals=JSON.parse(vals)
          if (typeof this.UserID=='undefined'||typeof this.GroupID=='undefined')
          {
            this.UserID=$('#UserID').text()
            this.GroupID=parseInt($('#GroupID_').attr('content'))
          }
          console.log(vals);
          for (i in vals){
            console.log("for");
            if (parseInt(vals[i].GroupID)!=this.GroupID)
            {
              console.log(vals[i].GroupID,'  ',this.GroupID);
              continue}
            console.log("endfor");
            if (vals[i].Sender==this.UserID){
              //发信人是自己
              console.log('appending');
              $('#content').append("<li class='even'>"+
              '<a class="user" href="#"><img style="height:40px" class="img-responsive avatar_" src="'+(typeof vals[i].Avatar!='undefined'?vals[i].Avatar:'default.png')+'" alt=""><span class="user-name">'+vals[i].Sender+'</span></a><div class="reply-content-box">'+
              '<span class="reply-time">'+vals[i].Send_date+'</span>'+
              '<div class="reply-content pr><span class="arrow">&nbsp;</span>'+vals[i].Content+'</div>'+
              '</div>'+
              "</li>")
            }else{
              //发信人是他人
              $('#content').append("<li class='odd'>"+
              '<a class="user" href="#"><img style="height:40px" class="img-responsive avatar_" src="'+(typeof vals[i].Avatar!='undefined'?vals[i].Avatar:'default.png')+'" alt=""><span class="user-name">'+vals[i].Sender+'</span></a><div class="reply-content-box">'+
              '<span class="reply-time">'+vals[i].Send_date+'</span>'+
              '<div class="reply-content pr><span class="arrow">&nbsp;</span>'+vals[i].Content+'</div>'+
              '</div>'+
              "</li>")
            }
            console.log($("#content").scrollTop()+$(".li").height);
            $("#content").scrollTop($("#content").scrollTop()+120)
          }
        })

        this.sendUser=function(){

          var info=new Array()
          info[0]=new Object()
          info[0].UserID=this.UserID
        this.socket.emit('userinfo',JSON.stringify(info))
        flag=1;
        }
        this.sendMessage=function()
        {
          var message=new Array()
          message[0]=new Object()
          message[0].Sender=this.UserID
          message[0].GroupID=this.GroupID
          message[0].Content=$('#input_message').val()
          $('#input_message').val('')
          this.socket.emit('message',JSON.stringify(message))
        }
        this.disconnect=function()
        {
          console.log('disconnect');
          this.socket.emit('beforedisconnect',JSON.stringify(UserID))
        }
    }
