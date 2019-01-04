var ylkMonitor = (function () {
    'use strict';

    function performance(config,global){
        var performance=global.performance||window.performance;

        if(performance&&performance.timing){
            var timing=performance.timing;
            var uglifyTiming={};
            for (var key in timing) {
                uglifyTiming[key.replace(/[^*][a-z]+/,'')]=String(timing[key]).substring(5);
                
            }

            console.log(timing);
        }
    }

    var  utils = {
        assignObject: function ( obj1, obj2 ) {
            for ( var name in obj2 ) {
              if ( obj2.hasOwnProperty( name ) ) {
                obj1[ name ] = obj2[ name ];
              }
            }
            return obj1;
        },
       
    };

    function index(global,config){
        var  _config = {
            id: '',  //上报id
            mergeReport: true, //mergeReport 是否合并上报， false 关闭， true 启动（默认）
            delay: 1000,  // 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
            url: '',      // 指定错误上报地址
            ignore:[],
            submit:null, //自定义上报方式，填写function,入参为url，和log
            random: 1,    // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
            performanceReport:false,
            errorReport:false
          };


        var ylkMonitor=global.ylkMonitor={
            init: function(config) {
                //merge配置
                var mergeConfig=utils.assignObject(_config,config);

                performance(config);

                


            }
        };
    }

    return index;

}());
