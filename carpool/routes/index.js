var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session')
var mysql=require('./mysqlconnect')
var logmanager=require('./login')
var carpoolmanager=require('./carpoolmanager')

var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var defaultface='default.png'
// router.use(cookieParser());
// router.use(session(
//   {
//       secret:'landscape',
//       name:'connect.sid',
//       cookie:{maxAge:1400000},
//   }
// ));
var showPalace=function(req,res,next){
  console.log('showPalace');
  carpoolmanager.FilterCarpool(null,null,null, null, null, function(callback,vals){
    if (callback=='fail') vals=null;
      res.render('palace',{
        carpools:vals,
        UserID:req.session.user
      })
  })

}
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('login', { title: 'Express' });
  res.render('login',{content:'欢迎来到Zhe拼'})
});
router.post('/login',function(req,res,next){
  console.log('post login');
  logmanager.checkifin(req.body.userid,req.body.password,function(feedback){
    if (feedback=='Success'){
      console.log('登陆成功');
      req.session.user=req.body.userid
      console.log(req.session);
      res.redirect('/palace')
    }else {
      console.log('登录失败');
    }
  })
})
router.post('/registe',function(req,res,next){
  console.log('post registe');
  console.log(req.body);
  logmanager.registe(req.body.userid,req.body.password,req.body.gender,req.body.detail,function(feedback){
    if (feedback=='UserExists'){
      console.log('用户名重复');
      res.render('login',{content:'用户名重复'})
    }else {
      console.log('注册成功');
      res.render('login',{content:'注册成功'})
    }
  })
})
router.get('/BeginCarpool',function(req,res,next){

})
router.get('/login', function(req, res, next) {
  //res.render('login', { title: 'Express' });
  console.log('get login');
  res.render('login',{content:'欢迎来到Zhe拼'});
});
router.get('/test',function(req,res,next){
  console.log('get test');
  var carpools=[{PoolID:1,Departure:'Departure',Destination:'Destination',D_date:'2016-02-03 9:00',Capacity:5}]
  res.render("editprofile",{
    carpools:carpools,
    UserID:'测试者',
    user:[{Gender:'f',Introduction:'hahahahahah'}]
  })
})
router.get('/palace',showPalace)
/***********/
/*筛选拼车信息*/
router.post('/palace',function(req,res,next){
  console.log('post palace');

})
/**********/
/*加入拼车*/
router.get('/joinCarpool',function(req,res,next){
  var PoolID=req.query.PoolID
  carpoolmanager.JoinCarpool(PoolID, req.session.user, function(feedback){
    if (feedback=='success'){
      res.render('joinsuccess',{
        UserID:req.session.user
      })
    }
  })
})
router.post('/BeginCarpool',function(req,res,next){
console.log('BeginCarpool');
carpoolmanager.BeginCarpool(req.session.user, req.body.Departure, req.body.Destination, req.body.D_date, req.body.Capacity, req.body.contact, function(feedback){
  if (feedback=='success'){
    showPalace(req,res,next)
  }
})
})
router.get('/pooldetail',function(req,res,next){
  var poolID=req.query.Carpool
  carpoolmanager.FilterCarpool(poolID,null,null,null,null,function(feedback,vals1){
    console.log(vals1);
    carpoolmanager.UsersInCarpool(poolID,function(qerr,vals,fields){
      console.log(vals);
      res.render('pooldetail',{
        UserID:req.session.user,
        users:vals,
        carpools:vals1
      })
    })
  })
})
router.get('/editprofile',function(req,res,next){
  logmanager.showprofile(req.session.user, function(qerr,vals,fields){
    res.render('editprofile',{
      UserID:req.session.user,
      user:vals
    })
  })
})

router.post('/editprofile',function(req,res,next){
  //生成multiparty对象，并配置上传目标路径
  console.log(req);
   var form = new multiparty.Form({uploadDir: './'});
   //上传完成后处理
   form.parse(req, function(err, fields, files) {
     var filesTmp = JSON.stringify(files,null,2);

     if(err){
       console.log('parse error: ' + err);
     } else {
       console.log('parse files: ' + filesTmp);
       var inputFile = files.inputFile[0];
       var uploadedPath = inputFile.path;
       var dstPath = './public/files/' + inputFile.originalFilename;
       //重命名为真实文件名
       fs.rename(uploadedPath, dstPath, function(err) {
         if(err){
           console.log('rename error: ' + err);
         } else {
           console.log('rename ok');
         }
       });
     }

})
})

/******加入聊天*****/
router.get('/contact',function(req,res,next){
  res.render('contact',{
    UserID:req.session.user
  })
})
module.exports = router;
