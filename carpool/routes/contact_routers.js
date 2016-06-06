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
var contactmanager=require('./contactmanager')
var defaultface='default.png'

router.get('/',function(req,res,next){
  console.log('get into contact');
  var GroupID=req.query.GroupID
  var UserID=req.session.user
  if (typeof GroupID=='undefined'){
    //第一次访问contact
    contactmanager.show_all_contact(UserID, function(qerr,vals,fields){
      req.session.contact=vals
      console.log('>>>>>>>>>>>>>>show all',vals);
      res.render('contact',{
        GroupID:(vals.length==0)?0:vals[0].GroupID,
        contact:(vals.length==0)?null:vals,
        UserID:req.session.user
      })
    })
  }else {
    res.render('contact',{
      GroupID:GroupID,
      contact:req.session.contact,
      UserID:req.session.user
    })
  }
})

module.exports=router
