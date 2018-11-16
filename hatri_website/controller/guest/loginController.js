var express = require('express');
var config = require('../../config/config');
var loginController = express.Router();
var http = require('http');
var request = require('request');
var passport = require('passport');
var moment = require('moment');
var service = require('../../services/service');
var LocalStrategy = require('passport-local').Strategy;

loginController.get('/dangnhap', function (req, res) {
	res.render('login', { title: 'Đăng nhập' });
});
//Thiet lap phien lam viec 
passport.serializeUser(function (user, done) {
	done(null, user.id);
});
//Thiet lap thong tin nguoi dung vao req
passport.deserializeUser(function (id, done) {
	done(null, { id: id });
});
//Kich ban kiem tra dang nhap
passport.use(new LocalStrategy({
	username: 'username	',
	passwordField: 'password',
	passReqToCallback: true
},
	function (req, username, password, done) {
		var data = {

		};
		var options = service.setOption('get', config.urladdress + '/api/user/getByUserName/:' + username,
			{ 'Content-Type': 'application/x-www-form-urlencoded' }, data);
		service.get(options, function (error, user) {
			if (error) {
				req.flash('error_msg', 'Lỗi khi xác thực tài khoản');
				return done(null, false);
			} else {
				var userData = JSON.parse(user);
				if (!user) {
					return done(null, false, req.flash('error_msg', 'No user found.'));
				}
				if (!user.validPassword(password)) {
					return done(null, false, req.flash('error_msg', 'Oops! Wrong password.'));
				}
				req.session.userid = userData.user_id;
				req.session.username = userData.username;
				return done(null, { id: userData.user_id, name: userData.username })
			}

		});
	}));
//Xu li dang nhap
loginController.post('/dangnhap',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/trangchu/dangnhap', failureFlash: true }),
	function (req, res) {
		res.redirect('/dangnhap');
	});

module.exports = loginController;