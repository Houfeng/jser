"use strict";

var db = require("../common/db");

//定义用户模型
var User = module.exports = db.model('user', {
    email: String,
    password: String,
    name: String,
    avatar: String
}); 

//创建一个新用户
User.create = function () {
    return new User();
};

//加载所有用户
User.load = function (callback) {
    var self = User;
    self.find({}, function (err, list) {
        self.list = list;
        if (callback) callback(err, list);
    });
};

//登录一个用户
User.signIn = function (user, callback) {
    var self = User;
    if (user.email == '' || user.password == '') {
        return callback({
            status: false,
            message: '用户或者密码错误',
            data: user
        });
    }
    self.findOne({ "email": user.email, "password": user.password }, function (err, foundUser) {
        if (err) {
            return callback({
                status: false,
                message: '发生了异常:' + err,
                data: user
            });
        }
        if (foundUser) {
            return callback({
                status: true,
                message: '登陆成功',
                data: user
            });
        } else {
            return callback({
                status: false,
                message: '用户或者密码错误',
                data: user
            });
        }
    });
};

//通过 oauth 认证一个用户
User.oAuth = function (user, callback) {
    var self = User;
    if (user.email == '' || user.password == '') {
        return callback({
            status: false,
            message: 'oAuth 发生了异常',
            data: user
        });
    }
    self.findOne({ "email": user.email }, function (err, foundUser) {
        if (err) {
            return callback({
                status: false,
                message: '发生了异常:' + err,
                data: user
            });
        }
        if (foundUser) {
            return callback({
                status: true,
                message: '登陆成功',
                data: foundUser
            });
        } else {
            user.save(function (err) {
                if (err) {
                    return callback({
                        status: false,
                        message: '发生了异常:' + err,
                        data: user
                    });
                }
                return callback({
                    status: true,
                    message: '登陆成功',
                    data: user
                });
            });
        }
    });
};

//检查注册用户
User._checkSignUp = function (user) {
    var self = this;
    return user.email && user.password;
};

//注册一个用户
User.signUp = function (user, callback) {
    var self = this;
    if (!self._checkSignUp(user)) {
        return callback({
            status: false,
            message: '用户信息不合法',
            data: user
        });
    }
    user.save(function (err) {
        if (err) {
            return callback({
                status: false,
                message: '发生了异常:' + err,
                data: user
            });
        }
        return callback({
            status: true,
            message: '注册成功',
            data: user
        });
    });
};