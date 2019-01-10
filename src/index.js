
import Reporter from './Reporter'
import performanceModule from './performance'
import errorModule from './error'
import utils from './utils'


var _config = {
    id: '',  //上报id
    mergeReport: true, //mergeReport 是否合并上报， false 关闭， true 启动（默认）
    delay: 1,  // 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
    url: 'http://127.0.0.1:5500',      // 指定错误上报地址
    random: 1,    // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
    performance: {
        open: true,
        random: 1,
    },
    error: {
        open: true,
        random: 1,
        repeat: 5,  //一次访问，异常超过多少次，将不上报。
        ignore: [],
    },
    waitLoadTime: 5,//五秒等待load触发，超时强行上报performance
}

var ylkMonitor = window.ylkMonitor = {
    init: function (config) {
        var global = window;
        // 检查config必填项

        if (!config.url) {
            console.warn('ylkMonitor options’s url is needed');
            return
        }
        if (!config.id) {
            console.warn('ylkMonitor options’s id is needed');
            return
        }
        //merge配置
        if (config.performance === true||config.performance===undefined) {
            config.performance = _config.performance;
        } else if (config.performance) {
            config.performance = utils.assignObject(_config.performance, config.performance)
        }
        if (config.error === true||config.error===undefined) {
            config.error = _config.error;
        } else if (config.error) {
            config.error = utils.assignObject(_config.error, config.error)
        }
        var mergeConfig = utils.assignObject(_config, config)
        // 实例化上报器
        var reporter = this.reporter = new Reporter(mergeConfig, global, this.onSubmit);
        // 启动性能收集模块
        console.log(mergeConfig.error && mergeConfig.error.open === true,mergeConfig)
        if (mergeConfig.performance && mergeConfig.performance.open === true) {
            performanceModule(global, mergeConfig, reporter);
        }
        // 启动异常收集模块
        if (mergeConfig.error && mergeConfig.error.open === true) {
            errorModule(global, mergeConfig, reporter)
        };


        this.IS_INIT = true
    },
    // 加入队列上报
    push: function (data) {
        if (this.IS_INIT && this.reporter) {
            this.reporter.push(data)
        }

    },
    // 跳过队列，直接上报
    submit: function (data) {
        if (this.IS_INIT && this.reporter) {
            this.reporter.submit(data)
        }
    },
    on: function (eventName, func) {
        if (this.IS_INIT && this.reporter) {
            this.reporter.on(eventName, func)
        }
    }
}

export default ylkMonitor;