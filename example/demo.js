// Define the callback to run 100-200 times per second
var tick = 0;
function demo(){
    tick++;
    if(tick%100 == 0) process.stdout.write('.');
}

var hertzTimer = require('../index.js'); 
var hertzCounter = new hertzTimer.counter(10);
var config = {
    hertzCounter: hertzCounter,
    callback: demo,
    stopTime: 10000,
    active:   true,
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
generator.on('stopped', function(){ console.log('Cycles stopped');     });
