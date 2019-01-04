export default function performance(config,global){
    var performance=global.performance||window.performance;

    if(performance&&performance.timing){
        var timing=performance.timing;
        var uglifyTiming={}
        for (var key in timing) {
            uglifyTiming[key.replace(/[^*][a-z]+/,'')]=String(timing[key]).substring(5)
            
        }

        console.log(timing)
    }
}