
import Reporter from './Reporter'
import performanceModule from './performance'
import errorModule from './error'
import utils from './utils'






var _config = {
    id: '',  //上报id
    mergeReport: true, //mergeReport 是否合并上报， false 关闭， true 启动（默认）
    delay: 1000,  // 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
    url: 'http://127.0.0.1:5500',      // 指定错误上报地址
    ignore: [],
    submit: null, //自定义上报方式，填写function,入参为url，和log
    random: 1,    // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
    performanceReport: false,
    errorReport: false,
    waitLoadTime:5,//五秒等待load触发，超时强行上报performance
}


var ylkMonitor = window.ylkMonitor = {
    init: function (global, config) {
        //merge配置
        var mergeConfig = utils.assignObject(_config, config)
        // console.log(config)
        var report = new Reporter(mergeConfig, global);

    
        performanceModule(global,mergeConfig,report);

        errorModule(global,mergeConfig,report )
        
        // performance(global,config,report);
    },
    
}



export default ylkMonitor;