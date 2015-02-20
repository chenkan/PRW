/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    'new': function (req, res) {
        res.view();
    },

    create: function (req, res) {
        var paramObj = {
            login: req.param('login'),
            nickname: req.param('nickname'),
            password: req.param('password')
        };

        // Create a User with the params sent from
        // the sign-up form --> new.ejs
        User.create(paramObj, function userCreated(err, user) {

            if (err) {
                console.log(err);
                req.session.flash = {
                    err: err
                };
                return res.redirect('/user/new');
            }

            // res.json(user);
            User.publishCreate(user);
            req.session.user_detail = user;
            res.redirect('/');

        });
    },

    show: function (req, res, next) {
        User.findOne(req.param('id'), function foundUser(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }

            // res.json(user);
            res.view({
                user: user
            });
        });
    },

    index: function (req, res, next) {
        User.find().exec(function foundUsers(err, users) {
            if (err) {
                return next(err);
            }
            if (req.isSocket) {
                res.send(users); // 这里是对socket请求的响应
            } else {
                res.view({
                    users: users
                });
            }

        });
    },

    edit: function (req, res, next) {

        User.findOne(req.param('id'), function foundUser(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next('user doesn\'t exist.');
            }

            res.view({
                user: user
            });
        });
    },

    update: function (req, res, next) {
        var paramObj = {
            name: req.param('name'),
            robot: req.param('robot')
        };

        User.update(req.param('id'), paramObj, function userUpdated(err) {
            if (err) {
                console.log(err);
                req.session.flash = {
                    err: err
                };
                return res.redirect('/user/edit/' + req.param('id'));
            }
            res.redirect('/user/show/' + req.param('id'));
        });
    },

    destroy: function (req, res, next) {

        User.findOne(req.param('id'), function foundUser(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next('User doesn\'t exist.');
            }
            User.destroy(req.param('id'), function userDestroyed(err) {
                if (err) {
                    return next(err);
                }
            });
            res.redirect('/user');
        });
    }

};
