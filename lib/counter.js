class HertzCounter {
    constructor(arraySize = 60){
        this.arraySize = arraySize; // Validate array
        this.data = {
            labels: new Array(arraySize),
            values: new Array(arraySize),
            minValue: null,
            maxValue: null,
            counter: 0,
            lastUpdate: null
        };
    }
    
    add() {
        this.data.counter++;
        let now = Date().toString();
        
        if (this.data.labels[0] == now) {
            this.data.values[0]++;
        } else {
            this.data.labels.unshift(now);
            this.data.labels.pop();

            this.data.values.unshift(1);
            this.data.values.pop();

            let sum = 0;
            let len = 0;
            let min = null;
            let max = null;

            // Don't count the first array entry (0) when calculating avg/min/max
            // It's always incrementing, so will sway the numbers; only use 'stable' values
            for( let i = 1; i < this.data.values.length; i++ ){
                let val = this.data.values[i];
                if(val){
                    sum += this.data.values[i];
                    len++;
                    
                    if(!min || val < min) min = val;
                    if(!max || val > max) max = val;
                }
            }
            this.data.avg = Math.floor(sum/len);
            this.data.minValue = min;
            this.data.maxValue = max;
            this.data.lastUpdate = now;
            
            //console.log(this);
        }
    }

    reset() {
        this.data = {
            labels: new Array(this.arraySize),
            values: new Array(this.arraySize),
            minValue: null,
            maxValue: null,
            counter: 0,
            lastUpdate: null
        };
    }
    
    get size() {
        return this.arraySize;
    }

    set size(newArraySize) {
        if(newArraySize < this.arraySize){
            this.data.labels = this.data.labels.slice(0,newArraySize);
            this.data.values = this.data.values.slice(0,newArraySize);
            this.arraySize   = newArraySize;
        } else if(newArraySize > this.arraySize) {
            this.data.labels.length = newArraySize;
            this.data.values.length = newArraySize;
            this.arraySize          = newArraySize;
        }
        
    }
}

module.exports = HertzCounter;