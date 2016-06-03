//定义Zhepin类
var Zhepin = new Object()

Zhepin.socket = null;
Zhepin.init = function() {
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        var UserID=$('#UserID').text()
        var GroupID=$('#GroupID_').text()
        this.socket.on('connect', function() {
            //连接到服务器后，显示昵称输入框
            console.log('connection build');
          })
        this.socket.on('message_from_server',function(vals){
          vals=JSON.parse(vals)
          for (i in vals){
            if (vals[i].GroupID!=GroupID) continue
            if (vals[i].UserID==UserID){
              //发信人是自己
              $('#content').append("<li class='even'>"+
              '<a class="user" href="#"><img style="height:40px" class="img-responsive avatar_" src="'+(typeof vals[i].Avatar!='undefined'?vals[i].Avatar:'default.png')+'" alt=""><span class="user-name">'+vals[i].UserID+'</span></a><div class="reply-content-box">'+
              '<span class="reply-time">'+vals[i].Send_date+'</span>'+
              '<div class="reply-content pr><span class="arrow">&nbsp;</span>'+vals[i].Content+'</div>'+
              '</div>'+
              "</li>")
            }else{
              //发信人是他人
              $('#content').append("<li class='odd'>"+
              '<a class="user" href="#"><img style="height:40px" class="img-responsive avatar_" src="'+(typeof vals[i].Avatar!='undefined'?vals[i].Avatar:'default.png')+'" alt=""><span class="user-name">'+vals[i].UserID+'</span></a><div class="reply-content-box">'+
              '<span class="reply-time">'+vals[i].Send_date+'</span>'+
              '<div class="reply-content pr><span class="arrow">&nbsp;</span>'+vals[i].Content+'</div>'+
              '</div>'+
              "</li>")
            }
          }
        })
        this.sendUser=function(){

          var info=new Array()
          info[0]=new Object()
          info[0].UserID=UserID
        this.socket.emit('userinfo',JSON.stringify(info))
        }
        this.sendMessage=function()
        {
          var message=new Array()
          message[0]=new Object()
          message[0].UserID=UserID
          message[0].GroupID=GroupID
          message[0].Content=$('#input_message').val()
          $('#input_message').val('')
          this.socket.emit('message',JSON.stringify(message))
        }

    }
