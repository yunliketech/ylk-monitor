
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
      }
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
}




export default utils;