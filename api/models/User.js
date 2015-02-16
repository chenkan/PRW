/**
 * User.js
 */
var bcrypt = require('bcryptjs');
module.exports = {

  autosubscribe: ['create', 'destroy', 'update'],

  attributes: {
    login: {
      type: 'string',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    salt: {
      type: 'string'
     // required: true
    },
    nickname: {
      type: 'string'
    },
    token: {
      type: 'string'
    },
    socket: {
      type: 'string'
    },
    gold_coin: {
      type: 'integer',
      defaultsTo: 3200
    },
    diamond: {
      type: 'integer',
      defaultsTo: 0
    },
    robot_name: {
      type: 'string',
      defaultsTo: "M1机甲"
    },
    skill_point: {
      type: 'integer',
      defaultsTo: 0
    },
    status: { // see bootstrap.js
      type: 'integer',
      defaultsTo: 0
    },
    fight_info: {
      type: 'json',
      defaultsTo: {
        total: 0,
        win: 0,
        fail: 0
      }
    },
    equipment_cards: {
      type: 'json',
      defaultsTo: {
        main_weapon: 110000,
        assist_weapon: 120010,
        engine_body: 130000,
        accessory: 140000
      }
    },
    active_skill_cards: {
      // 该字段的 array 格式：
      // [100004, 100005, ...]
      // 当前最大6张牌，里面的 num 为卡牌的 id
      type: 'array',
      defaultsTo: []
    },
    passive_skill_cards: {
      // 该字段的 array 格式：
      // [100004, 100005, ...]
      // 当前最大4张牌，里面的 num 为卡牌的 id
      type: 'array',
      defaultsTo: []
    },
    my_cards: {
      // 该字段的 array 格式：
      // [100004, 100005, ...]
      // 代表用户拥有的卡牌，装备的卡牌只能从这里面选择，里面的 num 为卡牌的 id
      type: 'array',
      defaultsTo: [110000, 120010, 130000, 140000]
    }
  },

  beforeCreate: function(values, next) {
    var salt = bcrypt.genSaltSync(10);

    bcrypt.hash(values.password, salt, function(err, hash) {
      if (err) return next(err);
      values.password = hash;
      values.salt = salt;
      next();
    });
  }
};

