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

describe('Pipe EventsSubSet', ()=>{
	let mtOne = new EventEmitter();
	let mtTwo = new EventEmitter();

	mtOne.pipe('subSet.*', mtTwo);

	it('#on event in the sub set (basic test)', (done)=>{
		mtTwo.on('subSet.pipeEventOk', (...arg)=>{
			if(arg.length === 2 && arg[0] === 'an argument' && arg[1] === 'another'){
				done();
			}
		});
		mtOne.emit('subSet.pipeEventOk', 'an argument', 'another');
	});

	it('#on event in the wrong sub set', (done)=>{
		mtTwo.on('subSet.pipeEventOk2', (...arg)=>{
			if(arg.length === 2 && arg[0] === 'an argument' && arg[1] === 'another'){
				done();
			}
		});
		mtTwo.on('subSet2.pipeEventOk2', (...arg)=>{
			if(arg.length === 2 && arg[0] === 'an argument' && arg[1] === 'another'){
				done("error");
			}
		});
		mtOne.emit('subSet2.pipeEventOk2', 'an argument', 'another');
		mtOne.emit('subSet.pipeEventOk2', 'an argument', 'another');
	});

	it('prevent loops', (done)=>{
		let eventE1 = new EventEmitter(),
				eventE2 = new EventEmitter();

		eventE1.pipe('loop.*', eventE2);
		eventE1.pipe('noLoop.*', eventE2);
		eventE2.pipe('loop.*', eventE1);
		eventE1.on('loop.event', ()=>{
			done('error');
		});
		eventE2.on('noLoop.event', ()=>{
			done('error');
		});
		eventE1.emit('loop.event');
		eventE2.emit('noLoop');
	});

});

describe('MultiEventEmitter', () => {
	it('#on() and #emit() multi', (done) => {
		let multiEventEmitter = new EventEmitter();

		multiEventEmitter
			.on('a.*.c', function multi(args) {
				done();
		});
		multiEventEmitter.emit('a.b.c');
	});
	it('#on() and #emit() listen on two events', (done) => {
		let multiEventEmitter = new EventEmitter();

		let countCalls = 0;

		multiEventEmitter
			.on('a.b.*', function multi(args) {
				countCalls ++;
		});
		multiEventEmitter.emit('a.b.x');
		multiEventEmitter.emit('a.b.y');

		assert(countCalls, 2);
		done();
	});
});
