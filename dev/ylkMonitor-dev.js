var ylkMonitor = (function () {
    'use strict';

    function Reporter(config, global) {

        this.config = config;

        this.submit_log = [];

        this.error_times = {};

        this.merge_lock = false;

        this.events = {};

        this.push = function (item) {

            var isRepeat = this.isRepeat(item);

            if (isRepeat) {
                return
            }
            this.submit_log.push(item);
            this.report();
        };

        this.report = function () {
            var _this = this;
            // console.log('merge判断', config.mergeReport, this.submit_log.length > 0, !this.merge_lock)
            if (config.mergeReport && this.submit_log.length > 0) {
                if (!this.merge_lock) {
                    _this.merge_lock = true;

                    setTimeout(function () {
                        _this.submit();
                        _this.merge_lock = false;
                    }, config.delay * 1000);
                } else {
                    // waiting上报
                    return
                }
            } else {
                _this.submit();
            }
        };

        this.submit = function (submitMsg) {
            var _this = this;

            var data = {
                id: config.id,
                log: submitMsg ? [submitMsg] : this.submit_log,//如果data_log存在，则直接上报，如果不存在，上报submit_log
                device: null,
                time: new Date().getTime()
            };

            data.device = this.getDeviceInfo();

            // console.log(data)
            var xhr = new XMLHttpRequest();
            //设置请求的类型及url

            xhr.open('post', config.url);
            //post请求一定要添加请求头才行不然会报错
            xhr.setRequestHeader("Content-type", "application/json");
            this.trigger('beforeReport',data);
            //发送请求
            xhr.send(JSON.stringify(data));



            if (!submitMsg) {
                // 清空队列
                _this.submit_log = [];
            }
            xhr.onreadystatechange = function () {
                // 这步为判断服务器是否正确响应
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // console.log(xhr.responseText);
                    this.trigger('afterReport',data);
                }
            };
        };

        this.getDeviceInfo = function () {
            var g = global || window;
            return g.navigator.userAgent;
        };

        this.isRepeat = function (item) {
            if (item.hash) {
                var times = this.error_times[item.hash] = (this.error_times[item.hash] || 0) + 1;
                return config.error.repeat > 0 && times > config.error.repeat;
            } else {
                return false
            }
        };
        // 触发
        this.trigger = function (eventName, msg) {
            if (this.events[eventName]&&this.events[eventName].length>0) {
                this.events[eventName].forEach(function(func) {
                    func(msg);
                });
            }
        };
        // 绑定监听
        this.on = function (eventName, func) {
            if(!this.events[eventName]){
                this.events[eventName]=[func];
            }else{
                this.events[eventName].push(func);
            }
        };
    }

    var I64BIT_TABLE =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

    var utils = {
      assignObject: function (obj1, obj2) {
        for (var name in obj2) {
          if (obj2.hasOwnProperty(name)) {
            obj1[name] = obj2[name];
          }
        }
        return obj1;
      },
      addLoadEvent: function (func) {
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
          window.onload = func;
        } else {
          window.onload = function () {
            oldonload();
            func();
          };
        }
      },
      isOBJByType: function (o, type) {
        return Object.prototype.toString.call(o) === "[object " + (type || "Object") + "]";
      },
      processStackMsg: function (error) {
        var stack = error.stack
          .replace(/\n/gi, "")
          .split(/\bat\b/)
          .slice(0, 9)
          .join("@")
          .replace(/\?[^:]+/gi, "");
        var msg = error.toString();
        if (stack.indexOf(msg) < 0) {
          stack = msg + "@" + stack;
        }
        return stack;
      },
      hash: function (input) {
        var hash = 5381;
        var i = input.length - 1;

        if (typeof input == 'string') {
          for (; i > -1; i--)
            hash += (hash << 5) + input.charCodeAt(i);
        }
        else {
          for (; i > -1; i--)
            hash += (hash << 5) + input[i];
        }
        var value = hash & 0x7FFFFFFF;

        var retValue = '';
        do {
          retValue += I64BIT_TABLE[value & 0x3F];
        }
        while (value >>= 6);

        return retValue;
      }
    };

    function performanceModule (global, config, reporter) {
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
                        uglifyTiming[key] = (timing[key] + '').substring(6);
                    }
                }
                reporter.submit({
                    type: 'performance',
                    data: uglifyTiming,
                });
                PERFORMANCE_ISREPORT=true;
                return uglifyTiming
            }
        }
        
        // onload超时，不等待，上报performance
        setTimeout(function () {
            console.log(config.waitLoadTime,LOAD_COMPELETE);
            if(!LOAD_COMPELETE){
                excutePerformance();
            }
        }, config.waitLoadTime*1000);

    }

    function errorModule (global, config, reporter) {

        var g = global || window;

        g.onerror = function (msg, url, line, col, error) {
            var newMsg = msg;

            if (error && error.stack) {
                newMsg = utils.processStackMsg(error);
            }

            if (utils.isOBJByType(newMsg, "Event")) {
                newMsg += newMsg.type ?
                    ("--" + newMsg.type + "--" + (newMsg.target ?
                        (newMsg.target.tagName + "::" + newMsg.target.src) : "")) : "";
            }
            if (Math.random() < (config.error.random || config.random)) {
                errorPush({
                    msg: newMsg,
                    target: url,
                    rowNum: line,
                    colNum: col,
                    _orgMsg: msg
                });
            }
        };


        window.addEventListener('error', function (e) {
            e.stopImmediatePropagation();
            var srcElement = e.srcElement;
            if (srcElement === window) ; else {
                // 元素错误，比如引用资源报错
                // console.log(e)
                // console.log(srcElement.tagName)
                // console.log(srcElement.src);

                if (Math.random() < (config.error.random || config.random)) {

                    errorPush({
                        url: srcElement.src || srcElement.href,
                        tag: srcElement.tagName,
                    });
                }
            }
        }, true);



        window.addEventListener('unhandledrejection', function (e) {
            e.preventDefault();
            // console.log(e)// unhandledrejection
            if (Math.random() < (config.error.random || config.random)) {

                errorPush({
                    msg: e.reason.message || "_",
                    stack: e.reason.stack || "_",
                });
            }
        });

        function errorPush(data) {
            reporter.push({
                type: 'error',
                data: data,
                hash: utils.hash(JSON.stringify(data))
            });
        }

    }

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
    };

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
                config.performance = utils.assignObject(_config.performance, config.performance);
            }
            if (config.error === true||config.error===undefined) {
                config.error = _config.error;
            } else if (config.error) {
                config.error = utils.assignObject(_config.error, config.error);
            }
            var mergeConfig = utils.assignObject(_config, config);
            // 实例化上报器
            var reporter = this.reporter = new Reporter(mergeConfig, global, this.onSubmit);
            // 启动性能收集模块
            console.log(mergeConfig.error && mergeConfig.error.open === true,mergeConfig);
            if (mergeConfig.performance && mergeConfig.performance.open === true) {
                performanceModule(global, mergeConfig, reporter);
            }
            // 启动异常收集模块
            if (mergeConfig.error && mergeConfig.error.open === true) {
                errorModule(global, mergeConfig, reporter);
            }

            this.IS_INIT = true;
        },
        // 加入队列上报
        push: function (data) {
            if (this.IS_INIT && this.reporter) {
                this.reporter.push(data);
            }

        },
        // 跳过队列，直接上报
        submit: function (data) {
            if (this.IS_INIT && this.reporter) {
                this.reporter.submit(data);
            }
        },
        on: function (eventName, func) {
            if (this.IS_INIT && this.reporter) {
                this.reporter.on(eventName, func);
            }
        }
    };

    return ylkMonitor;

}());
