var express = require('express');
var config = require('../../config/config.json');
var loginController = express.Router();
var http = require ('http');
var request = require('request');
var passport = require('passport');
var moment = require('moment');

loginController.get('/dangnhap', function(req, res) {
	res.render('login', {title:'Đăng nhập'});
});

module.exports = loginController;