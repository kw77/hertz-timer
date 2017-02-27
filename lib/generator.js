
var EventEmitter = require('events').EventEmitter;

class HertzGenerator extends EventEmitter {
    constructor({
        // Define defaults
        active   = true,
        minHertz = 1,
        maxHertz = 20,
        stopCount = null,
        stopTime  = 60000,
        wakeCycle = 1000,
        variationEvery = 1000,
        hertzVariation = 20,
        hertzCounter = null,
        callback = null
        } = {} )
    {
        super();
        
        // Define object properties
        this._active    = active;
        this.maxHertz   = maxHertz;
        this.minHertz   = minHertz;
        this.stopCount  = stopCount;
        this.stopTime   = stopTime;
        this.wakeCycle  = wakeCycle;
        this.variationEvery = variationEvery;
        this.hertzVariation = hertzVariation;
        this.hertzCounter = hertzCounter;
        this.callback = callback;
        
        this.runCounter = 0;
        this.runTimeout = null;
        this.lastVariation = null;
        this.startTime = new Date();
        this.endTime = null;
        
        this.cycle();
    }
    
    cycle() {
        // Recreate 'self' reference for setTimeout when 'this' has no context
        // NB: vars have function scope, needs to be redefined within each cycle
        var self = this;
                        
        if(this._active){
            if(this.callback) this.callback();
    
            var cycleTimestamp = new Date();
            var elapsedTime = cycleTimestamp - this.startTime;

            // If a special hertCounter object is being used, increment
            // Either way, increment the internal runCounter each cycle
            if(this.hertzCounter) this.hertzCounter.add();
            this.runCounter++;
            
            if(this.stopCount && this.runCounter >= this.stopCount){
                // If run cycle limit AND limit reached; stop
                this.stop();
                this.emit('complete');
            } else if(this.stopTime && elapsedTime >= this.stopTime){
                // If run time limit AND limit reached; stop
                this.stop();
                this.emit('complete');
            } else {
                // Evaluate if cycle timing variation change is due
                // based on time since last variation 
                // (if so recalculate and store new cycle interval/timeout)
                let timeSinceVariation = cycleTimestamp - this.lastVariation;
                
                if(timeSinceVariation >= this.variationEvery){
                    let variation = Math.floor( Math.random() * (this.hertzVariation) );
                    let hertz     = this.maxHertz - variation;
                    if(hertz < this.minHertz){
                        hertz = this.minHertz;
                    }
                    // Calc ms wait between cycles based on new hertz value
                    this.runTimeout = Math.floor(1000 / hertz);
                    // Reset last variation timestamp
                    this.lastVariation = cycleTimestamp;
                }
            }
            setTimeout(function(){ self.cycle(); },this.runTimeout);
        } else {
            setTimeout(function(){ self.cycle(); },this.wakeCycle);
        }  
    }
    
    start(){
        if(!this._active){
            if(this.hertzCounter) this.hertzCounter.reset();
            this.runCounter = 0;
            this.startTime = new Date();            
            this.endTime = null;
            this._active = true;
            this.emit('started');
        } 
    }
    
    stop(){
        if(this._active){
            this._active = false;
            this.endTime = new Date();
            this.lastVariation = null;
            this.emit('stopped',this);
        }
    }
    
    get active() {
        return this._active;
    }

    set active(newValue) {
        if (newValue){
            this.start();
        } else {
            this.stop();
        }
    }
}

module.exports = HertzGenerator;