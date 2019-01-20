import utils from "./utils";


export default function (global, config, reporter) {
    // 抽样判断
    if(Math.random()>(config.performance.random||config.random)){
        return
    }
    // 是否完成onload
    var LOAD_COMPELETE = false;
    // 是否已经上报了performance
    var PERFORMANCE_ISREPORT=false;

    // 为onload添加回调
    utils.addLoadEvent(function () {
       if(!PERFORMANCE_ISREPORT){
            excutePerformance();
            LOAD_COMPELETE=true;
       }
    });


    function excutePerformance() {
        var performance = global.performance || window.performance;
        if (performance && performance.timing) {
            var timing = performance.timing;
            var uglifyTiming = {};
            for (var key in timing) {
                if (typeof timing[key] === 'number') {
                    // uglifyTiming[key.substring(0,1)+key.replace(/[a-z]/g,'')]=(timing[key]+'').substring(5)
                    uglifyTiming[key] = (timing[key] + '').substring(6)
                }
            }
            reporter.submit({
                type: 'performance',
                data: uglifyTiming,
            })
            PERFORMANCE_ISREPORT=true;
            return uglifyTiming
        }
    }
    
    // onload超时，不等待，上报performance
    setTimeout(function () {
       
        if(!LOAD_COMPELETE){
            excutePerformance();
        }
    }, config.waitLoadTime*1000)

}