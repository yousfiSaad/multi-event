import Eventy from './src/multi-event'

let events = new Eventy();

events

.on('a.b.c', function(args){
  console.log('a.b.c', args);
})

.on('a.*.c', function(args){
  console.log('a.*.c', args);
})

.on('a.*.*', function(args){
  console.log('a.*.*', args);
})

.emit('a.b.c', "koko", 'soko');
