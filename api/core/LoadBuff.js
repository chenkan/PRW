/**
 * 加载Buff
 */
module.exports = {

  /**
   * 读取skill里面的Buff属性及Buff值（百分比）并进行加成
   * @param skill
   * @param me
   * @param other
   */
  loadBuff: function (skill, me, other) {
    module.exports.loadBuffWithFlag(skill, me, other, false);
  },

  /**
   * 撤销Buff
   * @param skill
   * @param me
   * @param other
   */
  unloadBuff: function (skill, me, other) {
    module.exports.loadBuffWithFlag(skill, me, other, true);
  },

  /**
   * @param skill
   * @param me
   * @param other
   * @param isUnBuff - 是否用于抵消Buff效果 一般用于Buff持续结束后回退Buff效果
   */
  loadBuffWithFlag: function (skill, me, other, isUnBuff) {
    // Buff Self
    var alterSelfTypes = (skill['alterSelfType'] + "").split(';');
    var alterSelfValues = (skill['alterSelfValue'] + "").split(';');
    buffAttrs(me, alterSelfTypes, alterSelfValues, isUnBuff);

    // Buff Other
    var alterOtherTypes = (skill['alterOtherType'] + "").split(';');
    var alterOtherValues = (skill['alterOtherValue'] + "").split(';');
    buffAttrs(other, alterOtherTypes, alterOtherValues, isUnBuff);
  }

};

/**
 * 加载一组Buff
 * - Buff值为百分比
 * - Buff始终有效 暂不考虑持续时间
 * @param player
 * @param attrTypes
 * @param attrValues
 * @param isUnBuff
 */
function buffAttrs(player, attrTypes, attrValues, isUnBuff) {
  for (var i = 0; i < attrTypes.length; i++) {
    var type = parseInt(attrTypes[i]);
    var value = parseFloat(attrValues[i]);
    switch(type)
    {
      case global.equipment.ATTR_ATTACK:
        buffAttr(player, "attack", value, isUnBuff);
        break;
      case global.equipment.ATTR_ARMOR:
        buffAttr(player, "armour", value, isUnBuff);
        break;
      case global.equipment.ATTR_SPEED:
        buffAttr(player, "attack_speed", value, isUnBuff);
        break;
      case global.equipment.ATTR_HIT:
        buffAttr(player, "hit_rate", value, isUnBuff);
        break;
      case global.equipment.ATTR_MISS:
        buffAttr(player, "dodge_rate", value, isUnBuff);
        break;
      case global.equipment.ATTR_BASH:
        buffAttr(player, "critical_rate", value, isUnBuff);
        break;
      case global.equipment.ATTR_AMMO:
        buffAttr(player, "ammo", value, isUnBuff);
        break;
      default:
        break;
    }
  }
}

/**
 * 加载一种Buff
 * @param player
 * @param attr  - 属性
 * @param value - Buff比值 / 百分比
 * @param isUnBuff - 是否用于抵消Buff效果
 */
function buffAttr(player, attr, value, isUnBuff) {
  var equipments = ['main_weapon', 'assist_weapon', 'engine_body', 'accessory'];

  // 遍历所有装备卡牌
  for (var i = 0; i < equipments.length; i++) {
    var equipment = player.equipment_cards[equipments[i]];
    if(isUnBuff) {
      equipment[attr] /= (value + 1);
    } else {
      equipment[attr] *= (value + 1);
    }

    // 整数 or 小数
    if (attr == "armour" || attr == "ammo") {
      equipment[attr] = Number(equipment[attr].toFixed(0));
    } else {
      equipment[attr] = Number(equipment[attr].toFixed(2));
    }
  }
}
