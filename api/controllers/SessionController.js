/**
 * 用户登录及在线状态维护
 * <doc> https://tower.im/projects/da9efe23f9d344c7946cbf770f80e1d5/docs/5f42dacda4a14b4eb3e39e9b39b54330/
 */

var bcrypt = require('bcryptjs');

module.exports = {

    'new': function (req, res) {
        res.view();
    },

    /**
     * 登录 / 创建会话
     * @param req
     * @param res
     */
    create: function (req, res) {
        var login = req.param('login');
        var password = req.param('password'); // TODO 不要明文传输及存储密码

        User.findOne({login: login}).exec(function (err, user) {
            if (err) {
                res.redirect("500");
            } else {
                var hash_password = bcrypt.hashSync(password, user.salt);
                if (user.password === hash_password) {
                    req.session.user_detail = user;
                    res.redirect("/");
                } else {
                    res.redirect("500");
                }
            }
        });
    },

    /**
     * 登出 / 销毁会话
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        req.session.destroy();
        res.redirect("/");
    },

    online: function (req, res) {
        var token = req.param('token');
        var socketId = sails.sockets.id(req.socket);

        User.find({token: token}).exec(function (err, data) {
            var rsp = {};
            if (err) {
                rsp.code = 500;
                res.send(rsp);
            } else {
                if (data.length != 1) {
                    rsp.code = 400;
                    res.send(rsp);
                } else {
                    var user = data[0];
                    User.update({id: user.id}, {
                        status: global.status.STATUS_ONLINE,
                        socket: socketId
                    }).exec(function after(err) {
                        if (err) {
                            rsp.code = 500;
                            res.send(rsp);
                        } else {
                            rsp.code = 200;
                            res.send(rsp);
                        }
                    });
                }
            }
        });
    },

    waitingBattle: function (req, res) {
        var socketId = sails.sockets.id(req.socket);

        User.find({socket: socketId}).exec(function (err, data) {
            var rsp = {};
            if (err) {
                rsp.code = 500;
                res.send(rsp);
            } else {
                if (data.length != 1) {
                    rsp.code = 400;
                    res.send(rsp);
                } else {
                    var user = data[0];
                    User.update({id: user.id}, {status: global.status.STATUS_WAITING_BATTLE}).exec(function after(err) {
                        if (err) {
                            rsp.code = 500;
                            res.send(rsp);
                        } else {
                            rsp.code = 200;
                            res.send(rsp);
                        }
                    });
                }
            }
        });
    },

    getOnlineUser: function (req, res) {
        User.find({status: global.status.STATUS_ONLINE}).exec(function (err, data) {
            var rsp = {};
            if (err) {
                rsp.code = 500;
                res.send(rsp);
            } else {
                rsp.code = 200;
                rsp.users = makeUserDTO(data);
                res.send(rsp);
            }
        });
    },

    getWaitingBattleUser: function (req, res) {
        User.find({status: global.status.STATUS_WAITING_BATTLE}).exec(function (err, data) {
            var rsp = {};
            if (err) {
                rsp.code = 500;
                res.send(rsp);
            } else {
                rsp.code = 200;
                rsp.users = makeUserDTO(data);
                res.send(rsp);
            }
        });
    },

    getUserInfo: function (req, res) {
        var login = req.param('login');

        User.find({login: login}).exec(function (err, data) {
            var rsp = {};
            if (err) {
                rsp.code = 500;
                res.send(rsp);
            } else {
                if (data.length != 1) {
                    rsp.code = 400;
                    res.send(rsp);
                } else {
                    var user = data[0];
                    var utils = require("../core/Utils");
                    var loaderByIds = utils.loadCardByIds;
                    var loaderById = utils.loadCardById;
                    var trim = utils.trimJson;
                    // 加载卡牌数据
                    user["active_skill_cards"] = loaderByIds(user["active_skill_cards"]);
                    user["passive_skill_cards"] = loaderByIds(user["passive_skill_cards"]);
                    user["my_cards"] = loaderByIds(user["my_cards"]);
                    user["equipment_cards"]["main_weapon"] = loaderById(user["equipment_cards"]["main_weapon"]);
                    user["equipment_cards"]["assist_weapon"] = loaderById(user["equipment_cards"]["assist_weapon"]);
                    user["equipment_cards"]["engine_body"] = loaderById(user["equipment_cards"]["engine_body"]);
                    user["equipment_cards"]["accessory"] = loaderById(user["equipment_cards"]["accessory"]);
                    // 裁剪不须要暴露的属性 / 裁剪哪些属性还须要考虑
                    var trimSet = ["cost", "increaseSelfType", "increaseSelfValue", "decreaseSelfType", "decreaseSelfValue", "decreaseOtherType", "decreaseOtherValue", "specialType", "specialValue", "interval", "duration", "upgradePoint", "attack", "armour", "attack_speed", "hit_rate", "dodge_rate", "critical_rate", "ammo", "password", "socket", "status", "token", "updatedAt", "skill_point"];
                    trim(user, trimSet);
                    rsp.code = 200;
                    rsp.data = {};
                    rsp.data.user_info = {};
                    rsp.data.user_info[login] = user;
                    res.send(rsp);
                }
            }
        });
    }

    // FIXME logout

};

/**
 * Utils
 */

/**
 * 生成UUID
 */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 原始user数据加工成传输至客户端的数据
 * @param rawUsers
 * @returns {Array}
 */
function makeUserDTO(rawUsers) {
    var filterUsers = [];
    for (var i = 0; i < rawUsers.length; i++) {
        var user = {};
        user.nickname = rawUsers[i].nickname;
        user.login = rawUsers[i].login;
        filterUsers.push(user);
    }
    return filterUsers;
}
