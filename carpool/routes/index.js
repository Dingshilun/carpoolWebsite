var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('login', { title: 'Express' });
  res.send(req.session.lastPage);
  req.session.lastPage='from your home2';

});


router.get('/home', function(req, res, next) {
  //res.render('login', { title: 'Express' });
  res.send(req.session.lastPage);
  req.session.lastPage='from your home1';

});

module.exports = router;
