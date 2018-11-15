var express = require('express');
var guestRouter =  express.Router();
var loginController = require('../controller/guest/loginController');

guestRouter.get('/',function(req,res){
	res.render('index', { title: 'Trang chủ'});
});

guestRouter.use('/trangchu', loginController);


module.exports = guestRouter;