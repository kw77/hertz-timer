#NODE hertz-timer - A basic event trigger and recording library

Ever need to trigger a event for testing purposes... but not just a twenty times per second? You're looking for something that can behave 
like in a more random fashion? hertz-timer comprises a number of claases to help.

## hertz-timer.generator

The generator is the core of hertz-time. It invokes the supplied callback with the following controls:

- Minimum hertz (hertz = times per second)
- Maximum hertz
- Hertz variation (minus up-to how many per variation phase)
- Variation change every x ms (if calculated every cycle, you get a very flat average very quickly)
- Stop time (how long to run for)
- Stop count (how many cycles to run)
- Wake cycle (how long to pause when stopped before checking to see if it should run again)

## hertz-timer.counter

An associated helper function for recording events happening X times per second (both can be used independently). The only control is to 
control how many seconds are stored,

##Example

For a full example, please see https://github.com/kw77/hertz-timer-demo

```javascript

// Define the callback to run 100-200 times per second
var tick = 0; function demo(){
tick++;
if(tick%100 == 0) process.stdout.write('.')

var hertzTimer = require('../index.js');
var hertzCounter = new hertzTimer.counter(10);
var config = {
    hertzCounter: hertzCounter,
    callback: demo,
    stopTime: 10000,
    active: true,
    minHertz: 100,
    maxHertz: 200,
    stopCount: null,
    wakeCycle: 1000,
    variationEvery: 1000,
    hertzVariation: 100
};
var generator = new hertzTimer.generator(config);
generator.on('complete',function(){ console.log('Cycles complete\n' ); }); 
generator.on('started', function(){ console.log('New cycles started'); });
generator.on('stopped', function(){ console.log('Cycles stopped'); });
```

##License
CC-BY-SA
