import utils from "./utils";
export default function (global, config, report) {

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
            report.push({
                type: 'error',
                data: {
                    msg: newMsg,
                    target: url,
                    rowNum: line,
                    colNum: col,
                    _orgMsg: msg
                }
            });
        }
    }


    window.addEventListener('error', function (e) {
        e.stopImmediatePropagation();
        var srcElement = e.srcElement;
        if (srcElement === window) {
            // 全局错误
            // console.log(e.message)
        } else {
            // 元素错误，比如引用资源报错
            // console.log(e)
            // console.log(srcElement.tagName)
            // console.log(srcElement.src);

            if (Math.random() < (config.error.random || config.random)) {
                report.push({
                    type: 'error',
                    data: {
                        url: srcElement.src || srcElement.href,
                        tag: srcElement.tagName,
                    }
                })
            }
        }
    }, true)



    window.addEventListener('unhandledrejection', function (e) {
        e.preventDefault();
        // console.log(e)// unhandledrejection
        if (Math.random() < (config.error.random || config.random)) {
            report.push({
                type: 'error',
                data: {
                    msg: e.reason.message || "_",
                    stack: e.reason.stack || "_",
                }
            })
        }
    })
}