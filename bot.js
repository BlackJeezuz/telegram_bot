'use strict';

var _telegraf = require('telegraf');

var _telegraf2 = _interopRequireDefault(_telegraf);

var _session = require('telegraf/session');

var _session2 = _interopRequireDefault(_session);

var _stage = require('telegraf/stage');

var _stage2 = _interopRequireDefault(_stage);

var _wizard = require('telegraf/scenes/wizard');

var _wizard2 = _interopRequireDefault(_wizard);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var token = '529289223:AAHeuR2xx62YkuaqwQS4PQnFYhY3NfEEZjc',
    apitoken = 'DDLiQV0Jxw1Ks83GdntyUcGrR8qgReYs',
    weatherKey = '02bfbe8cae6fc28d01c25647061d8124';

var bot = new _telegraf2.default(token);

var gif = new _wizard2.default('gif', // Имя сцены
function (ctx) {
  replyWithCancel(ctx, 'Enter search word:');
  return ctx.wizard.next(); // Переходим к следующему обработчику.
}, (0, _telegraf.mount)('message', function (ctx) {
  var apiUrl = 'http://api.giphy.com/v1/gifs/random?api_key=' + apitoken + '&tag=' + ctx.message.text;

  return (0, _nodeFetch2.default)(apiUrl).then(function (res) {
    return res.text();
  }).then(function (result) {
    var data = JSON.parse(result);
    console.log(data);

    if (!data.data.length) {
      var promise = new Promise(function (resolve, rejects) {
        ctx.reply('Can\'t find any gifs. Sorry \uD83D\uDE14');
        resolve();
      });

      return promise.then(function (resolve) {
        return ctx.scene.reenter();
      });
    }
    ctx.reply('Okay, I\'ll send you a ' + ctx.message.text + '\ndata.data.url');
    return ctx.scene.leave();
  }).catch(function (err) {
    ctx.reply('Some error occurs:\n<code>' + err + '</code>', { parse_mode: 'HTML' });
    return ctx.scene.leave();
  });
}));

function replyWithCancel(ctx, message) {
  ctx.reply(message, {
    reply_markup: {
      inline_keyboard: [[{ text: "exit", callback_data: 'cancel' }]]
    }
  });
}

var weatherCurrent = new _wizard2.default('weatherCurrent', // Имя сцены
function (ctx) {
  replyWithCancel(ctx, 'Enter your city, please:');
  return ctx.wizard.next(); // Переходим к следующему обработчику.
}, (0, _telegraf.mount)('message', function (ctx) {
  return (0, _nodeFetch2.default)('http://api.openweathermap.org/data/2.5/weather?q=' + ctx.message.text + '&lang=ua&units=metric&APPID=' + weatherKey).then(function (res) {
    return res.text();
  }).then(function (result) {
    var body = JSON.parse(result);

    ctx.reply('\u041F\u043E\u0433\u043E\u0434\u0430 \u0432 \u043C\u0456\u0441\u0442\u0456 <b>' + body.name + ' (' + body.sys.country + ')</b>\n\u041A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u0438 <i>lon:' + body.coord.lon + ' lat: ' + body.coord.lat + '</i>\n\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: <b>' + body.main.temp_min + ' - ' + body.main.temp_max + '</b>\n\u041F\u043E\u0433\u043E\u0434\u0430: ' + body.weather[0].description, { parse_mode: 'HTML' });
    return ctx.scene.leave();
  }).catch(function (err) {
    ctx.reply('Can\'t find your city. Sorry \uD83D\uDE14');
    return ctx.scene.reenter();
  });
}));

var weatherWeek = new _wizard2.default('weatherWeek', // Имя сцены
function (ctx) {
  replyWithCancel(ctx, 'Enter your city, please:');
  return ctx.wizard.next(); // Переходим к следующему обработчику.
}, (0, _telegraf.mount)('message', function (ctx) {
  return (0, _nodeFetch2.default)('http://api.openweathermap.org/data/2.5/forecast?q=' + ctx.message.text + '&lang=ua&units=metric&APPID=' + weatherKey).then(function (res) {
    return res.text();
  }).then(function (body) {
    var data = JSON.parse(body);

    ctx.reply('\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u043F\u043E\u0433\u043E\u0434\u0438 \u043D\u0430 \u0442\u0438\u0436\u0434\u0435\u043D\u044C \u0432 \u043C\u0456\u0441\u0442\u0456 <b>' + data.city.name + '(' + data.city.country + ')</b>\n\u041A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u0438: <i>(lat: ' + data.city.coord.lat + '; lon: ' + data.city.coord.lon + ')</i>\n\u041F\u043E\u043F\u0443\u043B\u044F\u0446\u0456\u044F: <i>' + data.city.population + '</i>\n', {
      parse_mode: 'HTML'
    });

    return data;
  }).then(function (data) {
    async function renderMessage(list) {
      var currentDate = '';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          var date = item.dt_txt.split(' ');

          if (date[0] !== currentDate) {
            await ctx.reply('\u2600 \u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u043D\u0430 <b>' + date[0] + '</b>\n', {
              parse_mode: 'HTML'
            });
          }

          await ctx.reply('***************\n<b>' + date[1] + '</b>\n\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: <b>' + item.main.temp + '</b> \u041C\u0430\u043A\u0441: <b>' + item.main.temp_max + '</b> \u041C\u0456\u043D: <b>' + item.main.temp_min + '</b>\n\u041F\u043E\u0433\u043E\u0434\u0430: <b>' + item.weather[0].description + '</b>\n\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u0432\u0456\u0442\u0440\u0443: <b>' + item.wind.speed + '</b>\n', {
            parse_mode: 'HTML'
          });

          currentDate = date[0];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    renderMessage(data.list);
    return ctx.scene.leave();
  }).catch(function (err) {
    ctx.reply('Can\'t find your city. Sorry. \uD83D\uDE14');
    return ctx.scene.reenter();
  });
}));

var validateMail = new _wizard2.default('validateMail', function (ctx) {
  replyWithCancel(ctx, 'Enter Your mail, please:');
  return ctx.wizard.next();
}, (0, _telegraf.mount)('message', function (ctx) {
  if (_validator2.default.isEmail(ctx.message.text + '')) {
    ctx.reply('Good mail! I accept it!');
    return ctx.scene.leave();
  }

  var promise = new Promise(function (resolve) {
    ctx.reply('Sorry, mail is not valid. Try again');
    resolve();
  });

  return promise.then(function () {
    return ctx.scene.reenter();
  });
}));

var validatePhone = new _wizard2.default('validatePhone', function (ctx) {
  replyWithCancel(ctx, 'Enter Your mobile phone, please:');
  return ctx.wizard.next();
}, (0, _telegraf.mount)('message', function (ctx) {
  if (_validator2.default.isMobilePhone(ctx.message.text + '', 'any')) {
    ctx.reply('Good phone! I accept it!');
    return ctx.scene.leave();
  }

  var promise = new Promise(function (resolve) {
    ctx.reply('Sorry, phone is not valid.\nThe mobile phone number must be supplied with the country code and therefore must start with +\nTry again');
    resolve();
  });

  return promise.then(function () {
    return ctx.scene.reenter();
  });
}));

var validateDate = new _wizard2.default('validateDate', function (ctx) {
  replyWithCancel(ctx, 'Enter date after current date, please:\nExample: 2099-10-22');
  return ctx.wizard.next();
}, (0, _telegraf.mount)('message', function (ctx) {
  if (_validator2.default.isISO8601(ctx.message.text + '') && _validator2.default.isAfter(ctx.message.text + '')) {
    ctx.reply('Good date! I accept it!');
    return ctx.scene.leave();
  }

  var promise = new Promise(function (resolve) {
    ctx.reply('Sorry, date is not correct.\n Look at the example below and try again');
    resolve();
  });

  return promise.then(function () {
    return ctx.scene.reenter();
  });
}));

var validateCard = new _wizard2.default('validateCard', function (ctx) {
  replyWithCancel(ctx, 'Enter your credit card number, please:\nExample: 5167985560417164');
  return ctx.wizard.next();
}, (0, _telegraf.mount)('message', function (ctx) {
  if (_validator2.default.isCreditCard(ctx.message.text + '')) {
    ctx.reply('Good card number! I accept it!');
    return ctx.scene.leave();
  }

  var promise = new Promise(function (resolve) {
    ctx.reply('Sorry, card number is not correct.\n Look at the example below and try again');
    resolve();
  });

  return promise.then(function () {
    return ctx.scene.reenter();
  });
}));

// Создаем менеджера сцен
var stage = new _stage2.default();

// Регистрируем сцену создания матча
stage.register(gif, weatherWeek, weatherCurrent, validateMail, validatePhone, validateDate, validateCard);

bot.use((0, _session2.default)());
bot.use(stage.middleware());

bot.start(function (ctx) {
  ctx.reply('Hi, ' + ctx.from.first_name + '!', {
    reply_markup: {
      keyboard: [['\uD83C\uDF3B Send gif', '\u26C5 Weather', 'Test validator']],
      resize_keyboard: true,
      force_reply: false,
      remove_keyboard: false
    }
  });
});

bot.hears(/\/stop/i, function (ctx) {
  return ctx.reply('Bye', {
    reply_markup: {
      remove_keyboard: true
    } });
});
bot.hears(/\uD83C\uDF3B Send gif/, function (ctx) {
  return ctx.scene.enter('gif');
});
bot.hears(/Test validator/, function (ctx) {
  ctx.scene.leave();

  ctx.reply('Choose option, please', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Validate mail', callback_data: 'validate_mail' }, { text: 'Validate phone', callback_data: 'validate_phone' }], [{ text: 'Validate credit card', callback_data: 'validate_card' }, { text: 'Validate date', callback_data: 'validate_date' }]]
    } });
});
bot.hears(/\u26C5 Weather/, function (ctx) {
  return ctx.reply('Choose option, please', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Current weather', callback_data: 'forecast_current' }, { text: 'Forecast for 5 days', callback_data: 'forecast_week' }]]
    }
  });
});

bot.action('forecast_week', function (ctx) {
  return ctx.scene.enter('weatherWeek');
});
bot.action('forecast_current', function (ctx) {
  return ctx.scene.enter('weatherCurrent');
});
bot.action('validate_mail', function (ctx) {
  return ctx.scene.enter('validateMail');
});
bot.action('validate_phone', function (ctx) {
  return ctx.scene.enter('validatePhone');
});
bot.action('validate_date', function (ctx) {
  return ctx.scene.enter('validateDate');
});
bot.action('validate_card', function (ctx) {
  return ctx.scene.enter('validateCard');
});
bot.action('cancel', function (ctx) {
  ctx.reply('Okay, I\'m out');
  ctx.scene.leave();
});

bot.startPolling();