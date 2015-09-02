//     multi-event 1.0.0
//     (c) 2015 Saad Yousfi <yousfi.saad@gmail.com>


function eventType(eventName) {
  let ret = {
    valid: false,
    type: 'mono' //molti/mono
      ,
    splited: []
  }
  ret.splited = eventName.split('.');
  for (let part of ret.splited) {
    let ok = /^[a-z0-9]+$/i.test(part);
    let ast = part === '*';
    if (!(ok || ast)) {
      return ret;
    }
    if (ast) {
      ret.type = 'multi';
    }
  }
  ret.valid = true;
  ret.name = eventName;
  return ret;
}

class Eventy {
  constructor() {
    this._events = {};
    this._multiEvents = {};

    this._mapMonoMulti = {}
  }

  getNamesMatchs(patternS) {
    let eventNames = Object.keys(this._events);
    let matchs = eventNames.filter((eName) => {
      let patternSCurrent = eName.split('.');
      if (patternS.length !== patternSCurrent.length) {
        return false;
      } else {
        for (let i in patternS) {
          if (patternS[i] !== '*' && patternSCurrent[i] !== patternS[i]) {
            return false;
          }
        }
      }

      return true;
    });

    return matchs;

  }

  on(eventName, callBack) {
    let infos = eventType(eventName);
    if (!infos.valid) {
      throw 'invalid name';
    }
    if(typeof callBack !== 'function'){
      throw 'you must give me a function';
    }
    let putOn = this._events;
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

  updateMapSet(infos) {
    let eventMatchs = this.getNamesMatchs(infos.splited);
    for (let name of eventMatchs) {
      let set = this._mapMonoMulti[name] = this._mapMonoMulti[name] || new Set();
      set.add(infos.name);
    }
  }

  emit(eventName, ...args) {
    let _this = this;
    let infos = eventType(eventName);
    if (!infos.valid) {
      throw 'invalid event';
    }
    if (infos.type === 'multi') {
      throw 'you can not emit multiple events, may be in the next version';
    }
    let listeners = [];
    Array.prototype.push.apply(listeners, this._events[eventName] || []);
    // let args =  Array.prototype.slice.call(arguments, 1);
    let set = this._mapMonoMulti[eventName];
    if (set) {
      for (let eventName of set) {
        let listenersMulti = _this._multiEvents[eventName];
        Array.prototype.push.apply(listeners, listenersMulti);
      }
    }
    for (let listener of listeners) {
      listener.apply( {eventName}, args );
    }

    return this;
  }

}


export default Eventy;
