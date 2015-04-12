/**
 * app.js
 *
 * Front-end code and event handling for sailsChat
 *
 */

var token = '';
var myName = '';
var enemyName = '';
var meObj;
var mp;
var mpClock;

// Attach a listener which fires when a connection is established:
io.socket.on('connect', function socketConnected() {

  io.socket.on('battle4init', function(data) {
    var trimSet = ["desc", "login", "nickname", "increaseSelfType","increaseSelfValue","decreaseSelfType","decreaseSelfValue","decreaseOtherType","decreaseOtherValue","specialType","specialValue","interval","duration","upgradePoint","diamond","type","gold_coin","my_cards","password","socket","status","token","updatedAt","skill_point"];
    trimJson(data, trimSet);
    if (data.code == 200) {
      meObj = data.data.user_info[myName];

      // 初始化主动技能卡牌
      $('.active-skill-btn').remove();
      $.each(meObj.active_skill_cards, function (index, value) {
        var e = $("<button class='active-skill-btn' data-activeskillid='" + value.id + "' data-cost='" + value['cost'] + "'>" + value.name + " " + value['cost'] + "MP</button>").appendTo('#active-skill-btns');
        e.click(function (event) {
          var btn = $(event.target);
          var skillId = btn.data('activeskillid');
          var skillCost = btn.data('cost');
          if (skillCost > mp) {
            $.alert('MP值不足');
          } else {
            mp -= skillCost;
            $('#mp').html(mp);
            btn.prop("disabled", true);
            io.socket.post('/activeskill/on', {myName: myName, enemyName: enemyName, skillId: skillId});
          }
        })
      });

      // 设置MP值 - 每秒增加1点MP
      $('#mp-div').show();
      mp = 0;
      $('#mp').html(mp);
      mpClock = setInterval(function () {
        mp += 1;
        $('#mp').html(mp);
      }, 1000);

      msgBoard(data.data.fight_info);
      showInBoard("info_board_1b", data.data.user_info[myName]);
      var players = Object.keys(data.data.user_info);
      for (var p in players) {
        if (players[p] != myName) {
          enemyName = players[p];
        }
      }
      showInBoard("info_board_2b", data.data.user_info[enemyName]);
    } else {
      showInBoard("info_board_5", "艹 挂了");

    }
  });

  io.socket.on('battle4timer', function(data) {
    if (data.code == 200) {
      showInBoard("info_board_1a", data.data.user_info[myName]);
      showInBoard("info_board_2a", data.data.user_info[enemyName]);
      msgBoard(data.data.fight_info);
    } else {
      showInBoard("info_board_5", "艹 挂了");
    }
  });

  io.socket.on('battle4active', function(data) {
    if (data.code == 200) {
      showInBoard("info_board_1a", data.data.user_info[myName]);
      showInBoard("info_board_2a", data.data.user_info[enemyName]);
      if(data.data.fight_info) {
        msgBoard(data.data.fight_info);
      }
    } else {
      showInBoard("info_board_5", "艹 挂了");
    }
  });

  io.socket.on('battle4active2', function(data) {
    if (data.code == 200) {
      showInBoard("info_board_1a", data.data.user_info[myName]);
      showInBoard("info_board_2a", data.data.user_info[enemyName]);
    } else {
      showInBoard("info_board_5", "艹 挂了");
    }
  });

  io.socket.on('battle4end', function(data) {
    msgBoard(data);
    clearInterval(mpClock);
  });

    io.socket.on('someone_online', function(data) {
        someoneOnline(data);
    });

    io.socket.on('someone_offline', function(data) {
        someoneOffline(data);
    });

    //    io.socket.on('system_info', function(data) {
  //        console.log(data);
  //        var textarea = $("#info_board");
  //        var text = textarea.val() + "\n" + data;
  //        textarea.val(text);
  //        textarea.scrollTop(9999);
  //    });

  console.log('Socket is now connected!');

  // When the socket disconnects, hide the UI until we reconnect.
  io.socket.on('disconnect', function() {
      // 离开『战斗』页面
      //if ($(location).attr('href').indexOf("battle_field") > -1) {
      //    io.socket.post('/session/offline');
      //}
  });

  $('#battle').click(battle);
  $('#wudi').click(wudi);
  $('#login-btn').click(login);
  $('#online').click(online);
  $('#getOnlineUser').click(getOnlineUser);
  $('#waitingBattle').click(waitingBattle);
  $('#getWaitingBattleUser').click(getWaitingBattleUser);
  $('#getUserInfo').click(getUserInfo);
  $('#clear_board_0').click(clearFightInfo);

    // 进入『战斗』页面
    if ($(location).attr('href').indexOf("battle_field") > -1) {
        login();
        online(waitingBattle);
    }

});


function battle() {
  enemyName = $('#enemyName').val();
  io.socket.post('/debug/quickBattle', {myName:myName, enemyName:enemyName});
}

function wudi() {
  io.socket.post('/debug/activeSkill2', {myName:myName, enemyName:enemyName, skillId:2014}); // FIXME - skillId
}

function login() {
    myName = $('#login').text();
  //var password = $('#password').val();
  //io.socket.post('/session/create', {login: login, password: password}, function(data) {
  //  var res = data;
  //  var code = res.code;
  //  if (code == 200) {
  //    token = res.user_info.token;
  //    var nickname = res.user_info.nickname ? res.user_info.nickname : res.user_info.login;
  //    showInBoard("info_board_5", "欢迎回来 " + nickname);
  //  } else {
  //    showInBoard("info_board_5", "登录失败");
  //  }
  //});
}

function online(done) {
  io.socket.post('/session/online', {token:token}, function(data) {
    var code = data.code;
    if (code === 200) {
      showInBoard("info_board_5", "你上线了");
        done();
    } else {
      showInBoard("info_board_5", "上线失败");
    }
  });
}

function getOnlineUser() {
  io.socket.post('/session/getOnlineUser', function(data) {
    var code = data.code;
    if (code === 200) {
      var users = data.users;
      var info = {};
      for (var i = 0; i < users.length; i++) {
        info[users[i].nickname] = users[i].login;
      }
      showInBoard("info_board_5", info);
    } else {
      showInBoard("info_board_5", "error");
    }
  });
}

function waitingBattle() {
  io.socket.post('/session/waitingBattle', function(data) {
    var code = data.code;
    if (code === 200) {
      showInBoard("info_board_5", "等待战斗！");
        getWaitingBattleUser();
    } else {
      showInBoard("info_board_5", "咦！再试试");
    }
  });
}

function getWaitingBattleUser() {
  io.socket.post('/session/getWaitingBattleUser', function(data) {
    var code = data.code;
    if (code === 200) {
      var users = data.users;
      var info = {};
        $.each(users, function (index, user) {
            $("#waiting_list").append('<li class="enemy_item list-group-item" id="' + user.login + '"><span class="badge">35%</span>' + user.nickname + '</li>');
            $("#" + user.login).click(function (event) {
                chooseEnemy($(event.target).attr('id'));
            });
        });
      showInBoard("info_board_5", info);
    } else {
      showInBoard("info_board_5", "error");
    }
  });
}

function someoneOnline(who) {
    if (who.login !== myName) {
        //noinspection JSJQueryEfficiency
        if ($("#" + who.login).length) {
            return;
        }
        $("#waiting_list").append('<li class="enemy_item list-group-item" id="' + who.login + '"><span class="badge">35%</span>' + who.nickname + '</li>');
        //noinspection JSJQueryEfficiency
        $("#" + who.login).hide().fadeIn(500).click(function (event) {
            chooseEnemy($(event.target).attr('id'));
        });
    }
}

function someoneOffline(who) {
    $("#" + who.login).fadeOut(500, function () {
        $("#" + who.login).remove();
    });
}

function getUserInfo() {
  var queryLogin = $('#queryLogin').val();
  io.socket.post('/session/getUserInfo', {login:queryLogin}, function(data) {
    var code = data.code;
    if (code == 200) {
      showInBoard("info_board_5", data.data);
    } else {
      showInBoard("info_board_5", "error");
    }
  });
}

function msgBoard(msg) {
  var textarea = $("#info_board_0");
  var text = textarea.val() + "\n" + msg;
  textarea.val(text);
  textarea.scrollTop(9999);
}

function showInBoard(boardId, msg) {
  if (typeof(msg) !="object") {
    var tmp = {};
    tmp.info = msg;
    msg = tmp;
  }
  document.getElementById(boardId).innerHTML = "";
  document.getElementById(boardId).appendChild(document.createTextNode(JSON.stringify(msg, null, 4)));
  $("#" + boardId).rokkoCode();
}

/**
 * 清空战斗对白
 */
function clearFightInfo() {
  var textarea = $("#info_board_0");
  textarea.val("");
}

/**
 * 迭代遍历JSON 删除指定节点
 * @param obj
 * @param nodeSet
 */
function trimJson (obj, nodeSet) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if(nodeSet.indexOf(property) > -1) {
        delete obj[property];
      }
      if (typeof obj[property] == "object") {
        trimJson(obj[property], nodeSet);
      }
    }
  }
}

function chooseEnemy(who) {
    if (who === myName) {
        return;
    }

    var allEnemies = $(".enemy_item");
    $.each(allEnemies, function (index, enemy) {
        $(enemy).removeClass("list-group-item-danger");
    });

    $("#" + who).addClass("list-group-item-danger");
    $("#enemyName").val(who);
}
