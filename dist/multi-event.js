//     multi-event 1.0.0
//     (c) 2015 Saad Yousfi <yousfi.saad@gmail.com>

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function eventType(eventName) {
  var ret = {
    valid: false,
    type: 'mono', //molti/mono

    splited: []
  };
  ret.splited = eventName.split('.');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ret.splited[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var part = _step.value;

      var ok = /^[a-z0-9]+$/i.test(part);
      var ast = part === '*';
      if (!(ok || ast)) {
        return ret;
      }
      if (ast) {
        ret.type = 'multi';
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  ret.valid = true;
  ret.name = eventName;
  return ret;
}

var Eventy = (function () {
  function Eventy() {
    _classCallCheck(this, Eventy);

    this._events = {};
    this._multiEvents = {};

    this._mapMonoMulti = {};
  }

  _createClass(Eventy, [{
    key: 'getNamesMatchs',
    value: function getNamesMatchs(patternS) {
      var eventNames = Object.keys(this._events);
      var matchs = eventNames.filter(function (eName) {
        var patternSCurrent = eName.split('.');
        if (patternS.length !== patternSCurrent.length) {
          return false;
        } else {
          for (var i in patternS) {
            if (patternS[i] !== '*' && patternSCurrent[i] !== patternS[i]) {
              return false;
            }
          }
        }

        return true;
      });

      return matchs;
    }
  }, {
    key: 'on',
    value: function on(eventName, callBack) {
      var infos = eventType(eventName);
      if (!infos.valid) {
        throw 'invalid name';
      }
      if (typeof callBack !== 'function') {
        throw 'you must give me a function';
      }
      var putOn = this._events;
      if (infos.type === 'multi') {
        putOn = this._multiEvents;
      }
      putOn[eventName] = putOn[eventName] || [];
      if (-1 === putOn[eventName].indexOf(callBack)) {
        putOn[eventName].push(callBack);
        if (infos.type === 'multi') {
          this.updateMapSet(infos);
        }
      }

      return this;
    }
  }, {
    key: 'updateMapSet',
    value: function updateMapSet(infos) {
      var eventMatchs = this.getNamesMatchs(infos.splited);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = eventMatchs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _name = _step2.value;

          var set = this._mapMonoMulti[_name] = this._mapMonoMulti[_name] || new Set();
          set.add(infos.name);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'emit',
    value: function emit(eventName) {
      var _this = this;
      var infos = eventType(eventName);
      if (!infos.valid) {
        throw 'invalid event';
      }
      if (infos.type === 'multi') {
        throw 'you can not emit multiple events, may be in the next version';
      }
      var listeners = [];
      Array.prototype.push.apply(listeners, this._events[eventName] || []);
      // let args =  Array.prototype.slice.call(arguments, 1);
      var set = this._mapMonoMulti[eventName];
      if (set) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = set[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _eventName = _step3.value;

            var listenersMulti = _this._multiEvents[_eventName];
            Array.prototype.push.apply(listeners, listenersMulti);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
              _iterator3['return']();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        for (var _iterator4 = listeners[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var listener = _step4.value;

          listener.apply({ eventName: eventName }, args);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return this;
    }
  }]);

  return Eventy;
})();

exports['default'] = Eventy;
module.exports = exports['default'];
