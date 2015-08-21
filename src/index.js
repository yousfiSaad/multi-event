//     multi-event 1.0.0
//     (c) 2015 Saad Yousfi <yousfi.saad@gmail.com>

class Eventy {
  constructor() {
    this._listerers = {};
    this._maxListeners = 10;
  }

  on(eventName, callBack) {
    this._listerers[eventName] = this._listerers[eventName] || [];
    if (this._listerers[eventName].length > this._maxListeners) {
      throw `You try to trigger more than ${this._maxListeners} to this event : ${eventName}`;
    }
    if (-1 === this._listerers[eventName].indexOf(callBack)) {
      this._listerers[eventName].push(callBack);
    }

    return this;
  }

  emit(eventName, args) {
    let listeners = this._listerers[eventName] || [];
    Array.prototype.slice.call(arguments, 1);
    for (let listener of listeners) {
      listener.apply(this, arguments);
    }

    return this;
  }

  off(eventName, callBack) {
    let listeners = this._listerers[eventName] || [];
    if (callBack) {
      let ind = listeners.indexOf(callBack);
      if (ind !== -1) {
        listeners.splice(ind, 1);
      }
    }
    else {
      this._listerers[eventName] = undefined;
    }

    return this;
  }

}








export default Eventy;
