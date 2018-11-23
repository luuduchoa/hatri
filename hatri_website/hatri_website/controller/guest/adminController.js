var express = require('express');
var config = require('../../config/config');
var adminController = express.Router();
var http = require('http');
var request = require('request');
var passport = require('passport');
var moment = require('moment');
var service = require('../../services/service');
var LocalStrategy = require('passport-local').Strategy;

adminController.get('/dangnhap', function (req, res) {
	res.render('login', { title: 'Đăng nhập' });
});

adminController.get('/trangquantri',function(req,res){
	res.render("admin/adminLayout", {title: 'Trang quản trị',secu: config.securitycode,token: req.session.token,conf:config.urladdress,userid:req.session.userid,username:req.session.username,fullName:req.session.fullName});
});

adminController.get('/trangquantri/themnguoidung', function(req,res){
	res.render("admin/createUser", {title: 'Thêm người dùng',secu: config.securitycode,token: req.session.token,conf:config.urladdress,userid:req.session.userid,username:req.session.username,fullName:req.session.fullName});
});

adminController.get('/trangquantri/danhsachnguoidung', function(req,res){
	res.render("admin/listUser", {title: 'Danh sách người dùng',secu: config.securitycode,token: req.session.token,conf:config.urladdress,userid:req.session.userid,username:req.session.username,fullName:req.session.fullName});
});

adminController.post('/trangquantri/themnguoidung', function(req, res){
	var token = "jwt " + req.session.token;
	var body ={
		user_fullName : req.body.user_fullName,
		user_userName : req.body.user_userName,
		user_password : req.body.user_password,
		user_birthday :req.body.user_birthday,
		user_phoneNumber : req.body.user_phone,
		user_email : req.body.user_email,
		user_address :req.body.user_address,
		role_id: req.body.role_id
	}; 
	var options = service.setOption('post',config.urladdress + '/api/user/create' ,{'Authorization':token, 'Content-Type': 'application/x-www-form-urlencoded'},body);
	service.post(options,function(error,data){
		if(error){
			return error;
		}else{ 
			res.redirect('/trangchu/trangquantri/danhsachnguoidung');
		} 
	});
});

adminController.get('/trangquantri/sua/:id', function(req,res){
	var id = req.params.id;
	var token = "jwt " + req.session.token; 
	var options = service.setOption('GET',config.urladdress + '/api/user/getById/' + id, {'Authorization':token, 'Content-Type': 'application/json'});
	service.get(options,function(error,data){
		if(error){
			return error;
		}else{
			data = JSON.parse(data);
			userData = data.data;
			res.render("admin/updateUser",{title:'Sửa thông tin người dùng',moment:moment,users:userData,conf:config.urladdress,secu:config.securitycode,token:req.session.token,userid:req.session.userid,username:req.session.username,fullName:req.session.fullName});
		} 
	});
});

adminController.post('/trangquantri/sua/:id', function(req,res){
	var token = "jwt " + req.session.token;
	var body ={
		user_fullName : req.body.user_fullName,
		user_userName : req.body.user_userName,
		user_birthday :req.body.user_birthday,
		user_phoneNumber : req.body.user_phone,
		user_email : req.body.user_email,
		user_address :req.body.user_address,
		role_id: req.body.role_id,
		user_lockStatus : req.body.user_lockStatus
	}; 
	console.log(body); 
	var id = req.params.id; 
	var options = service.setOption('put',config.urladdress + '/api/user/update/' + id,{'Authorization':token, 'Content-Type': 'application/x-www-form-urlencoded'},body);
	service.put(options,function(error,data){
		if(error){
			return error;
		}else{ 
			res.redirect('/trangchu/trangquantri/danhsachnguoidung');
		} 
	});
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
			user_userName: username,
			user_password: password,
			grant_type: 'password'
		};
		var options = service.setOption('post', config.urladdress + '/api/auth',
			{ 'Content-Type': 'application/x-www-form-urlencoded' }, data);
		service.post(options, function (error, user) {
			if (error) {
				req.flash('error_msg', 'Lỗi khi xác thực tài khoản');
				return done(null, false);
			} else {
				var userData = JSON.parse(user);
				if (userData.status) {
					req.flash('error_msg', userData.message);
					return done(null, false);
				} else {
					if (req.session.userid) {
                        delete req.session.token;
                        delete req.session.userid;
                        delete req.session.username;
                        delete req.session.fullName;
					}
					req.session.token = userData.accessToken;
					req.session.userid = userData.user_id;
					req.session.username = userData.username;
					req.session.fullName = userData.fullName;
					return done(null, { id: userData.user_id, name: userData.username })
				}
			}

		});
	}));
//Xu li dang nhap
adminController.post('/dangnhap',
	passport.authenticate('local', { successRedirect: '/trangchu/trangquantri', failureRedirect: '/trangchu/dangnhap', failureFlash: true }),
	function (req, res) {
		res.redirect('/trangchu/trangquantri');
	});
//Dang xuat
adminController.get('/dangxuat', function(req, res) {
	//Xoa du lieu luu trong req
	delete req.session.token;
    delete req.session.userid;
    delete req.session.username;
    delete req.session.fullName;
    req.flash('success_msg', 'Bạn đã đăng xuất');
    req.logout();
    res.redirect('/trangchu/dangnhap');
});

module.exports = adminController;