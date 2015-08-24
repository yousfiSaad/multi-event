var assert = require('assert');
import EventEmitter from './src';

describe('Eventy', () => {
  it('#on() and #emit()', (done) => {
    let eventEmitter = new EventEmitter();
    var originalEvent = {};
    eventEmitter.on('boom', function(event) {
      assert(event, originalEvent);
      done();
    });
    eventEmitter.emit('boom', originalEvent);
  });
});
