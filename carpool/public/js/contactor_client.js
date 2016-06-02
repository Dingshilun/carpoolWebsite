//定义Zhepin类
var Zhepin = new Object()

Zhepin.socket = null;
Zhepin.init = function() {
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        this.socket.on('connect', function() {
            //连接到服务器后，显示昵称输入框
          for (var i=0;i<100;i++)  document.getElementById('content').innerHTML+='<br><div>ahahahahahah<div>'
        })
    }
