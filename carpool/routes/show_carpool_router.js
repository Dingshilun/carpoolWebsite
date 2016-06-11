var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session')
var mysql=require('./mysqlconnect')
var logmanager=require('./login')
var carpoolmanager=require('./carpoolmanager')
var sock=require('./contactor')
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var defaultface='default.png'
var contact_routers=require('./contact_routers')
var moment=require('moment')
moment.locale('zh-cn')
router.get('/',function(req,res,next){
  var UserID=req.session.user
  carpoolmanager.ShowUserPool(UserID,function(feedback,vals){
    if (feedback=='success'){
      for (i in vals){
        vals[i].D_date=moment(vals[i].D_date).format('LLL')
      }
      res.render('showcarpool',{
        UserID:req.session.user,
        carpools:vals,
      UserPic:req.session.avatar})
    }
  })
})

module.exports=router
