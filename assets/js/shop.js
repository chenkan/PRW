var me;
var shop;

$('#getMyInfo').click(getMyInfo);

$('#mainWeapon').click(function () {
  hideAllKindCard();
  showCard4Class('card_main_weapon');
});
$('#assistWeapon').click(function () {
  hideAllKindCard();
  showCard4Class('card_assist_weapon');
});
$('#body').click(function () {
  hideAllKindCard();
  showCard4Class('card_body');
});
$('#attachment').click(function () {
  hideAllKindCard();
  showCard4Class('card_attachment');
});
$('#as').click(function () {
  hideAllKindCard();
  showCard4Class('card_as');
});
$('#ps').click(function () {
  hideAllKindCard();
  showCard4Class('card_ps');
});


function getMyInfo() {
  var myLogin = $('#myLogin').val();
  io.socket.post('/session/getUserInfo', {login: myLogin}, function (data) {
    var code = data.code;
    if (code === 200) {
      $('#getMyInfo').css("display", "none");
      me = data.data.user_info.myLogin;

      // 金币
      $('#gold').html(me.gold_coin);

      // 绘制我的卡牌 - 没有高亮已装备卡牌
      $.each(me.my_cards, function (index, value) {
        drawMyCard(value.id + "", value);
      });

      // 高亮已装备卡牌
      me.currentCards = [];
      if (me.equipment_cards) {
        if (me.equipment_cards.main_weapon) {
          me.currentCards.push(me.equipment_cards.main_weapon.id);
        }
        if (me.equipment_cards.assist_weapon) {
          me.currentCards.push(me.equipment_cards.assist_weapon.id);
        }
        if (me.equipment_cards.engine_body) {
          me.currentCards.push(me.equipment_cards.engine_body.id);
        }
        if (me.equipment_cards.accessory) {
          me.currentCards.push(me.equipment_cards.accessory.id);
        }
      }
      for (var p in me.active_skill_cards) {
        me.currentCards.push(me.active_skill_cards[p].id);
      }
      for (var q in me.passive_skill_cards) {
        me.currentCards.push(me.passive_skill_cards[q].id);
      }
      for (var m in me.currentCards) {
        var id = me.currentCards[m];
        $('.unEp[name=' + id + ']').first().removeClass('unEp').addClass('ep');
      }
    } else {
      alert("something goes wrong");
    }
  });

  // 访问商店数据
  getShopInfo();
}

/**
 * 绘制一张我的卡牌
 * @param index - card id
 * @param value - card obj
 */
function drawMyCard(index, value) {
  var div = $("<div></div>").appendTo('#myCards');
  var e = $("<button name='" + index + "'>" + value.name + " / " + value.desc + "</button>").appendTo(div);
  var e2 = $("<button>卖出</button>").appendTo(div);
  if (index.indexOf("1") === 0) {         // 武器卡
    if (value.type === 1) {
      e.addClass('card_main_weapon').click(function (event) {
        epOrUnEp(event.target);
      });
      e2.click(function (event) {
        sellCard(event.target);
      });
    }
    if (value.type === 2) {
      e.addClass('card_assist_weapon').click(function (event) {
        epOrUnEp(event.target);
      });
      e2.click(function (event) {
        sellCard(event.target);
      });
    }
    if (value.type === 3) {
      e.addClass('card_body').click(function (event) {
        epOrUnEp(event.target);
      });
      e2.click(function (event) {
        sellCard(event.target);
      });
    }
    if (value.type === 4) {
      e.addClass('card_attachment').click(function (event) {
        epOrUnEp(event.target);
      });
      e2.click(function (event) {
        sellCard(event.target);
      });
    }
  } else if (index.indexOf("2") === 0) { // 主动技能
    e.addClass('card_as').click(function (event) {
      epOrUnEp(event.target);
    });
    e2.click(function (event) {
      sellCard(event.target);
    });
  } else {                              // 被动技能
    e.addClass('card_ps').click(function (event) {
      epOrUnEp(event.target);
    });
    e2.click(function (event) {
      sellCard(event.target);
    });
  }

  e.addClass('unEp');        // 默认不高亮
}

/**
 * 显示指定卡牌
 * @param clazz
 */
function showCard4Class(clazz) {
  $('.' + clazz).parent().css("display", "block");
}

/**
 * 隐藏所有卡牌
 */
function hideAllKindCard() {
  $('[class^="card"]').parent().css("display", "none");
}

function getShopInfo() {
  io.socket.post('/shop/getShopInfo', function (data) {
    shop = data;
    $.each(shop, function (index, value) {
      var e = $("<div><button id='" + index + "'>" + value.card.name + " / " + value.card.desc + "</button></div>").appendTo('#shopCards');
      var e2 = $("<button>" + value.buyPrice + " G</button>").appendTo(e);

      // 购买动作
      e2.click(function (event) {
        buyCard($(event.target).parent().children(":first")[0].id);
      });

      // 卡牌星级
      if (value.star === 1) {
        e2.addClass('grey');
      }
      if (value.star === 2) {
        e2.addClass('blue');
      }
      if (value.star === 3) {
        e2.addClass('orange');
      }

      // 卡牌分类
      if (index.indexOf("1") === 0) {         // 武器卡
        if (value.card.type === 1) {
          $('#' + index).addClass('card_main_weapon').click(function (event) {
            showInBoard('card_info', shop[event.target.id]);
          }).dblclick(function (event) {
            buyCard(event.target.id);
          });
        }
        if (value.card.type === 2) {
          $('#' + index).addClass('card_assist_weapon').click(function (event) {
            showInBoard('card_info', shop[event.target.id]);
          }).dblclick(function (event) {
            buyCard(event.target.id);
          });
        }
        if (value.card.type === 3) {
          $('#' + index).addClass('card_body').click(function (event) {
            showInBoard('card_info', shop[event.target.id]);
          }).dblclick(function (event) {
            buyCard(event.target.id);
          });
        }
        if (value.card.type === 4) {
          $('#' + index).addClass('card_attachment').click(function (event) {
            showInBoard('card_info', shop[event.target.id]);
          }).dblclick(function (event) {
            buyCard(event.target.id);
          });
        }
      } else if (index.indexOf("2") === 0) { // 主动技能
        $('#' + index).addClass('card_as').click(function (event) {
          showInBoard('card_info', shop[event.target.id]);
        }).dblclick(function (event) {
          buyCard(event.target.id);
        });
      } else {                              // 被动技能
        $('#' + index).addClass('card_ps').click(function (event) {
          showInBoard('card_info', shop[event.target.id]);
        }).dblclick(function (event) {
          buyCard(event.target.id);
        });
      }
    });

  });
}

/**
 * 购买卡牌
 * @param cardId
 */
function buyCard(cardId) {
  io.socket.post('/shop/buyCard', {myName: me.login, cardId: cardId}, function (data) {
    if (data && data.code === 200) {
      $('#gold').html(data.gold);
      var value = data.value;
      drawMyCard(cardId, value);
    } else {
      alert('error');
    }
  });
}

/**
 * 卖出卡牌
 * - 不能卖出当前装备的卡牌
 * @param target
 */
function sellCard(target) {
  if (!$(target).parent().children(":first").hasClass('ep')) {
    io.socket.post('/shop/sellCard', {myName: me.login, cardId: $(target).parent().children(":first")[0].name}, function (data) {
      if (data && data.code === 200) {
        $('#gold').html(data.gold);
        $(target).parent().remove();
      } else {
        alert('error');
      }
    });
  } else {
    alert("暂不支持卖出装备着的卡牌");
  }
}

/**
 * 装备或者卸载卡牌
 * @param target
 */
function epOrUnEp(target) {
  if (!$(target).hasClass('ep')) {
    equipCard(target, target.name);
  } else {
    unEquipCard(target, target.name);
  }
}

/**
 * 装备卡牌
 * @param target
 * @param cardId
 */
function equipCard(target, cardId) {
  io.socket.post('/shop/equipCard', {myName: me.login, cardId: cardId}, function (data) {
    if (data && data.code === 200) {
      $(target).removeClass('unEp').addClass('ep');
    } else {
      alert(data);
    }
  });
}

/**
 * 卸载卡牌
 * @param target
 * @param cardId
 */
function unEquipCard(target, cardId) {
  io.socket.post('/shop/unEquipCard', {myName: me.login, cardId: cardId}, function (data) {
    if (data && data.code === 200) {
      $(target).removeClass('ep').addClass('unEp');
    } else {
      alert(data);
    }
  });
}

//if($('#getMyInfo')) {
//    getMyInfo();
//}
