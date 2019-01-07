var utils = {
  assignObject: function (obj1, obj2) {
    for (var name in obj2) {
      if (obj2.hasOwnProperty(name)) {
        obj1[name] = obj2[name];
      }
    }
    return obj1;
  },
  addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    } else {
      window.onload = function () {
        oldonload();
        func();
      }
    }
  },
  isOBJByType: function (o, type) {
    return Object.prototype.toString.call(o) === "[object " + (type || "Object") + "]";
  },
  processStackMsg:function(error) {
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
}




export default utils;