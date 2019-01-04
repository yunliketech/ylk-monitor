
import Reporter from './Reporter'
import performance from './performance'
import utils from './utils'





export default function(global,config){
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
      }


    var ylkMonitor=global.ylkMonitor={
        init: function(config) {
            //merge配置
            var mergeConfig=utils.assignObject(_config,config)
            // console.log(config)
            var report=new Reporter(config);

            performance(config);

            


        }
    }
};