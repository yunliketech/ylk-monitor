function Reporter(config, global) {

    this.config = config;

    this.submit_log = [];

    this._mergeReport = config.mergeReport;

    this._delay = config.delay;

    this.merge_lock = false;;

    this.push = function (item) {
        this.submit_log.push(item);
        this.report();
    }
    // item={
    //     type:'performance/error/api/resource'
    //     data
    // }

    this.report = function () {

        var _this = this;

        // console.log('merge判断', this._mergeReport, this.submit_log.length > 0, !this.merge_lock)
        if (this._mergeReport && this.submit_log.length > 0) {
            if (!this.merge_lock) {
                _this.merge_lock = true;

                setTimeout(function () {
                    _this.submit();
                    _this.merge_lock = false;
                }, this._delay * 1000)
            }else{
                // waiting上报
                return
            }

        } else {
            _this.submit();

        }
    }

    this.submit = function () {
        var _this = this;
        var data = {
            device: null,
            log: this.submit_log,
            time: new Date().getTime()
        };

        data.device = this.getDeviceInfo();

        // console.log(data)
        var xhr = new XMLHttpRequest();
        //设置请求的类型及url

        xhr.open('post', config.url);
        //post请求一定要添加请求头才行不然会报错
        xhr.setRequestHeader("Content-type", "application/json");

        //发送请求
        xhr.send(JSON.stringify(data));

        _this.submit_log = []
        xhr.onreadystatechange = function () {
            // 这步为判断服务器是否正确响应
           
            if (xhr.readyState == 4 && xhr.status == 200) {
                // console.log(xhr.responseText);

            }
        };
    }



    this.getDeviceInfo = function () {
        var g = global || window;
        // console.log(g.navigator.userAgent)
        return g.navigator.userAgent;
    }
}


export default Reporter;