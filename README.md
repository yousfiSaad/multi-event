[![Build Status](https://travis-ci.org/yousfiSaad/multi-event.svg?branch=master)](https://travis-ci.org/yousfiSaad/multi-event)

# Installation
- **Node.js, browserify** `npm install multi-event --save`
- **Require.js** `require(["multi-event"], ...`

# Examples

```javascript
var MultiEvent = require('multi-event'); // require it
var myEvents = new MultiEvent();

// Implement listener
var callBack = function (arg) {
    console.log(arg);
};

// Register callBack event listener
myEvents.on('event', callBack);

myEvents.emit('event', 'this will be passed to the callback');
// shows 'this will be passed to the callback' in console
```

# Multiple events Examples

```javascript
var MultiEvent = require('multi-event'); // require it
var myEvents = new MultiEvent();
var myEventsSubSet = new MultiEvent();

myEvents.pipe("event2.*", myEventsSubSet);

// Implement listener
var callBack1 = function (arg) {
    console.log('callBack1 says : '+ arg);
};
var callBack2 = function (arg) {
    console.log('callBack2 says : '+ arg);
};

var callBack = function (arg) {
    console.log('callBack says : '+ arg);
};

var pipeCallBack = function (arg) {
    console.log('pipeCallBack says : '+ arg + ' (from myEventsSubSet)');
};


// Register callBack event listener
myEvents.on('event.subevent1', callBack1)
        .on('event.subevent2', callBack2)
        .on('event.*', callBack); // this callBack is trigged to all 'event' sub-events
        
myEventsSubSet.on("event2.eventViaPipe", pipeCallBack);

myEvents.emit('event.subevent1', 'this string will be logged twice');
// the following will be displayed on the console
//  callBack1 says : this string will be logged twice
//  callBack says : this string will be logged twice
myEvents.emit('event.subevent2', 'this string will be logged twice');
// the following will be displayed on the console
//  callBack2 says : this string will be logged twice
//  callBack says : this string will be logged twice

myEvents.emit('event2.eventViaPipe', 'this will be passed to the other emitter also');
// the following will be displayed on the console
//  pipeCallBack says : this will be passed to the other emitter also (from myEventsSubSet)
```

# EcmaScript6
This module is writen in ES6, you can find the in `src/multi-event-es6.js`

For building your modification run `npm run build`, the files `multi-event.js` and `multi-event.min.js` are created in `dist` folder

## Build and test

- **Build** `npm run build`
- **Test** `npm run test`
- **Watch changes and run tests and buil** `npm run watch`

