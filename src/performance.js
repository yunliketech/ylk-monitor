import utils from "./utils";


export default function performance(global, config, report) {

    if (!config.performanceReport) {
        return
    }

    // 如果
    var LOAD_COMPELETE = false;
    var PERFORMANCE_ISREPORT=false;


    utils.addLoadEvent(function () {
        // console.log('load完成',PERFORMANCE_ISREPORT)
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
           
            report.push({
                type: 'performance',
                data: uglifyTiming,
            })
            // console.log('上报性能', uglifyTiming);
            PERFORMANCE_ISREPORT=true;
            return uglifyTiming
        }
    }
   
    setTimeout(function () {
        console.log(config.waitLoadTime,LOAD_COMPELETE)
        if(!LOAD_COMPELETE){
            // console.log('load超时')
            excutePerformance();
        }
    }, config.waitLoadTime*1000)

}