module.exports = {

    /**
     * 商店页面
     * @param req
     * @param res
     */
    showShop: function (req, res) {
        res.view("shop");
    },

    /**
     * 获取商店数据
     * @param req
     * @param res
     */
    getShopInfo: function (req, res) {
        res.send(global.card.SHOP);
    },

    /**
     * 购买卡牌
     * @param req
     * @param res
     */
    buyCard: function (req, res) {
        var myName = req.param('myName');
        var cardId = req.param('cardId');

        var shop = global.card.SHOP[cardId];
        if (!shop) {
            res.send('no this card in shop');
            return;
        }

        User.findOne({login: myName}, function foundUser(err, user) {
            if (err) {
                res.send('find() error');
                return;
            }

            if (!user) {
                res.send('no this user');
                return;
            }

            if (user.gold_coin >= shop.buyPrice) {
                user.gold_coin -= shop.buyPrice;
                user.my_cards.push(parseInt(cardId));

                User.update({login: myName}, user, function userUpdated(err) {
                    if (err) {
                        res.send('save() error');
                        return;
                    }

                    var rsp = {};
                    rsp.code = 200;
                    rsp.gold = user.gold_coin;
                    rsp.value = global.card.DATA_ALL[cardId];
                    res.send(rsp);
                });
            } else {
                res.send('not enough gold');
            }
        });
    },

    /**
     * 卖出卡牌
     * - 当前为原价卖出
     * @param req
     * @param res
     */
    sellCard: function (req, res) {
        var myName = req.param('myName');
        var cardId = req.param('cardId');

        var shop = global.card.SHOP[cardId];
        if (!shop) {
            res.send('no this card in shop');
            return;
        }

        User.findOne({login: myName}, function foundUser(err, user) {
            if (err) {
                res.send('find() error');
                return;
            }

            if (!user) {
                res.send('no this user');
                return;
            }

            user.gold_coin += shop.buyPrice;
            user.my_cards.splice(user.my_cards.indexOf(parseInt(cardId)), 1); // TODO 当前只能卖出未装备卡牌
                                                                              // TODO 检查我是否拥有这张卡牌

            User.update({login: myName}, user, function userUpdated(err) {
                if (err) {
                    res.send('save() error');
                    return;
                }

                var rsp = {};
                rsp.code = 200;
                rsp.gold = user.gold_coin;
                res.send(rsp);
            });
        });
    },

    /**
     * 装备卡牌
     * @param req
     * @param res
     */
    equipCard: function (req, res) {
        var myName = req.param('myName');
        var cardId = req.param('cardId');
        cardId = parseInt(cardId);

        User.findOne({login: myName}, function foundUser(err, user) {
            if (err) {
                res.send('find() error');
                return;
            }

            if (!user) {
                res.send('no this user');
                return;
            }

            if (user.my_cards.indexOf(cardId) === -1) {
                res.send('user not has this card');
                return;
            }

            if ((cardId + "").indexOf('1') === 0) {            // Weapon Card
                var type = global.card.DATA_ALL[cardId].type;
                if (type === 1) {
                    if (user.equipment_cards.main_weapon) {
                        res.send('pls unload current card before equip new card');
                        return;
                    }
                    user.equipment_cards.main_weapon = cardId;
                }
                if (type === 2) {
                    if (user.equipment_cards.assist_weapon) {
                        res.send('pls unload current card before equip new card');
                        return;
                    }
                    user.equipment_cards.assist_weapon = cardId;
                }
                if (type === 3) {
                    if (user.equipment_cards.engine_body) {
                        res.send('pls unload current card before equip new card');
                        return;
                    }
                    user.equipment_cards.engine_body = cardId;
                }
                if (type === 4) {
                    if (user.equipment_cards.accessory) {
                        res.send('pls unload current card before equip new card');
                        return;
                    }
                    user.equipment_cards.accessory = cardId;
                }
                saveUser(user, res);
            } else if ((cardId + "").indexOf('2') === 0) {     // AS Card
                var as = user.active_skill_cards;
                if (as.length >= 6 || count(as, cardId) >= 2) { // 携带卡牌数量限制
                    res.send('too many cards');
                } else {
                    as.push(cardId);
                    saveUser(user, res);
                }
            } else {                                          // PS Card
                var ps = user.passive_skill_cards;
                if (ps.length >= 4 || count(ps, cardId) >= 1) { // 携带卡牌数量限制
                    res.send('too many cards');
                } else {
                    ps.push(cardId);
                    saveUser(user, res);
                }
            }
        });
    },


    /**
     * 卸载卡牌
     * @param req
     * @param res
     */
    unEquipCard: function (req, res) {
        var myName = req.param('myName');
        var cardId = req.param('cardId');
        cardId = parseInt(cardId);

        User.findOne({login: myName}, function foundUser(err, user) {
            if (err) {
                res.send('find() error');
                return;
            }

            if (!user) {
                res.send('no this user');
                return;
            }

            if (user.my_cards.indexOf(cardId) === -1) {
                res.send('user not has this card');
                return;
            }

            if ((cardId + "").indexOf('1') === 0) {            // Weapon Card
                var type = global.card.DATA_ALL[cardId].type;
                if (type === 1 && user.equipment_cards.main_weapon === cardId) { // TODO 当前装备的卡牌不是cardId时应该给出error code
                    user.equipment_cards.main_weapon = 0;
                }
                if (type === 2 && user.equipment_cards.assist_weapon === cardId) {
                    user.equipment_cards.assist_weapon = 0;
                }
                if (type === 3 && user.equipment_cards.engine_body === cardId) {
                    user.equipment_cards.engine_body = 0;
                }
                if (type === 4 && user.equipment_cards.accessory === cardId) {
                    user.equipment_cards.accessory = 0;
                }
                saveUser(user, res);
            } else if ((cardId + "").indexOf('2') === 0) {     // AS Card
                var as = user.active_skill_cards;
                if (count(as, cardId) === 0) {
                    res.send('not equip this card now');
                } else {
                    as.splice(as.indexOf(cardId), 1);
                    saveUser(user, res);
                }
            } else {                                          // PS Card
                var ps = user.passive_skill_cards;
                if (count(ps, cardId) === 0) {
                    res.send('not equip this card now');
                } else {
                    ps.splice(ps.indexOf(cardId), 1);
                    saveUser(user, res);
                }
            }
        });
    }

};

/**
 * array里面有几个element
 * @param array
 * @param element
 * @returns {number}
 */
var count = function (array, element) {
    var result = 0;
    for (var o in array) {
        if (array[o] === element) {
            result++;
        }
    }
    return result;
};

var saveUser = function (user, res) {
    User.update({login: user.login}, user, function userUpdated(err) {
        if (err) {
            res.send('save() error');
            return;
        }
        res.send({code: 200});
    });
};
