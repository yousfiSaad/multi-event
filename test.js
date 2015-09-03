var assert = require('assert');
import EventEmitter from './src/multi-event-es6';

///// some tests from https://github.com/alexanderGugel/micro-events

var _noop = () => {};


describe('EventEmitter', () => {
	it('#on() and #emit()', (done) => {
		var eventEmitter = new EventEmitter();
		var originalEvent = {};
		eventEmitter.on('boom', function(event) {
			assert(event, originalEvent);
			done();
		});
		eventEmitter.emit('boom', originalEvent);
	});

	it('#emit() should work with multiple events in arguments', (done) => {
		var eventEmitter = new EventEmitter();
		var originalEvent1 = {};
		var originalEvent2 = {};
		var originalEvent3 = {};

		eventEmitter.on('boom', function(event1, event2, event3) {
			assert(event1, originalEvent1);
			assert(event2, originalEvent2);
			assert(event3, originalEvent3);

			done();
		});
		eventEmitter.emit('boom', originalEvent1, originalEvent2, originalEvent3);
	});

	it('#on() should only register handler once', (done) => {
		var eventEmitter = new EventEmitter();
		var originalEvent = {};
		var handler = function(event) {
			done();
		};
		eventEmitter.on('boom', handler);
		eventEmitter.on('boom', handler);
		eventEmitter.emit('boom', originalEvent);
	});


	it('functions should return this', () => {
		var eventEmitter = new EventEmitter();
		assert(eventEmitter.on('boom', _noop), eventEmitter);
		assert(eventEmitter.emit('boom', _noop), eventEmitter);
	});

	it('functions should check arguments', () => {
		var eventEmitter = new EventEmitter();
		assert.throws(() => {
			eventEmitter.on();
		});
		assert.throws(() => {
			eventEmitter.on('boom', 'Not a function');
		});
		assert.throws(() => {
			eventEmitter.emit();
		});
	});


});


describe('MultiEventEmitter', () => {
	it('#on() and #emit() multi', (done) => {
		let multiEventEmitter = new EventEmitter();

		multiEventEmitter
		// .on('a.*.c', function(args){
		//   console.log('lgi chi 7ajat');
		// })
			.on('a.b.c', function(args) {
			// console.log('lgi chi 7aja');
			done();
		});
		multiEventEmitter.emit('a.b.c');
	});
});
