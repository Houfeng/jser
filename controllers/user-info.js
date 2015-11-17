/* global nokit */
var User = require('../models/user');
var Topic = require("../models/topic");
var Comment = require("../models/comment");
var Message = require("../models/message");
var Task = nokit.Task;

/**
 * 活动控制器
 **/
var UserInfoController = function () { };

/**
 * 默认 action
 **/
UserInfoController.prototype.index = function () {
    var self = this;
    var userId = self.context.data("id");
    var task = Task.create();
    task.add(function (done) {
        User.getUser(userId, function (err, user) {
            if (err) {
                return self.context.error(err);
            }
            self.user = user;
            done();
        });
    });
    task.add(function (done) {
        Topic.getLastByUserId(userId, function (err, topicList) {
            if (err) {
                return self.context.error(err);
            }
            self.topicList = topicList;
            done();
        });
    });
    task.add(function (done) {
        Comment.getLastByUserId(userId, function (err, commentList) {
            if (err) {
                return self.context.error(err);
            }
            self.commentList = commentList;
            done();
        });
    });
    task.add(function (done) {
        Message.getAllByUserId(userId, function (err, msgList) {
            if (err) {
                return self.context.error(err);
            }
            self.msgList = msgList;
            done();
        });
    });
    task.end(function () {
        self.render("user-info.html", self);
    });
};

module.exports = UserInfoController;