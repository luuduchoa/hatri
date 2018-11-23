var express = require('express');
var guestRouter =  express.Router();
var adminController = require('../controller/guest/adminController');

guestRouter.get('/',function(req,res){
	res.render('index', { title: 'Trang chủ'});
});

guestRouter.use('/trangchu', adminController);


module.exports = guestRouter;