function Reporter(config, global) {

    this.config = config;

    this.submit_log = [];

    this.baseInfo = null;

    this.error_times = {}

    this.merge_lock = false;

    this.events = {};

    this.push = function (item) {

        var isRepeat = this.isRepeat(item);

        if (isRepeat) {
            return
        };

        this.submit_log.push(item);
        this.report();
    }

    this.report = function () {
        var _this = this;
        // console.log('merge判断', config.mergeReport, this.submit_log.length > 0, !this.merge_lock)
        if (config.mergeReport && this.submit_log.length > 0) {
            if (!this.merge_lock) {
                _this.merge_lock = true;

                setTimeout(function () {
                    _this.submit();
                    _this.merge_lock = false;
                }, config.delay * 1000)
            } else {
                // waiting上报
                return
            }
        } else {
            _this.submit();
        }
    }

    this.submit = function (submitMsg) {
        var _this = this;

        var data = {
            id: config.id,
            log: submitMsg ? [submitMsg] : this.submit_log, //如果data_log存在，则直接上报，如果不存在，上报submit_log
            baseInfo:null,
            userInfo:null,
            time: new Date().getTime()
        };
        // 携带基础信息
        data.baseInfo = this.baseInfo ? this.baseInfo : this.getBaseInfo();

        // 携带用户信息
        if (this.config.userInfo instanceof Function) {
            data.userInfo = this.config.userInfo()
        } else if(typeof this.config.userInfo ==='string' ){
            data.userInfo = this.config.userInfo
        }

        var xhr = new XMLHttpRequest();
        //设置请求的类型及url

        xhr.open('post', config.url);
        //post请求一定要添加请求头才行不然会报错
        xhr.setRequestHeader("Content-type", "application/json");
        this.trigger('beforeReport', data)
        //发送请求
        xhr.send(JSON.stringify(data));



        if (!submitMsg) {
            // 清空队列
            _this.submit_log = []
        }
        xhr.onreadystatechange = function () {
            // 这步为判断服务器是否正确响应
            if (xhr.readyState == 4 && xhr.status == 200) {
                // console.log(xhr.responseText);
                this.trigger('afterReport', data)
            }
        };
    }



    this.getBaseInfo = function () {
        // 基础信息，每次上报都会携带，
        var g = global || window;

        var baseInfo = {
            userAgent: g.navigator.userAgent,
            deviceWidth: g.screen.width,
            deviceHeight: g.screen.height,
            url:g.location.href
        }

        this.baseInfo = baseInfo;
        return baseInfo;
    }

    this.isRepeat = function (item) {
        if (item.hash) {
            var times = this.error_times[item.hash] = (this.error_times[item.hash] || 0) + 1;
            return config.error.repeat > 0 && times > config.error.repeat;
        } else {
            return false
        }
    }
    // 触发
    this.trigger = function (eventName, msg) {
        if (this.events[eventName] && this.events[eventName].length > 0) {
            this.events[eventName].forEach(function (func) {
                func(msg)
            });
        }
    }
    // 绑定监听
    this.on = function (eventName, func) {
        if (!this.events[eventName]) {
            this.events[eventName] = [func]
        } else {
            this.events[eventName].push(func)
        }
    }
}


export default Reporter;