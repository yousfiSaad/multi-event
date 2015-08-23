import Eventy from './src/'

let events = new Eventy();

let createLogiFunction = function(id){
  id--;
  let digits = ['one', 'two', 'three', 'gang of foor'];
  if(id < digits.length)
    return function(from){
      console.log(digits[id] + ' from ' + from);
    }
}

let ftwo = createLogiFunction(2);

events.on('one', createLogiFunction(1), 'one')

.on('two', createLogiFunction(1), 'two')
.on('two', createLogiFunction(2), 'two')

.on('three', createLogiFunction(1), 'three')
.on('three', ftwo, 'three')
.on('three', createLogiFunction(3), 'three')


.emit('one')

.emit('two')

.emit('three')

.off('three', ftwo)

.off('two')

.emit('two')

.emit('three')
