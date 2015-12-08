function getMillisecs() {
    return (new Date).getTime()
}

function milliTOtime(e) {
    var t = minutes = seconds = ms = 0,
        n = "";
    t = Math.floor(e / (60 * 60 * 1e3));
    e = e % (60 * 60 * 1e3);
    minutes = Math.floor(e / (60 * 1e3));
    e = e % (60 * 1e3);
    seconds = Math.floor(e / 1e3);
    ms = e % 1e3;
    n = adjust(t) + "  : " + adjust(minutes) + " : " + adjust(seconds);
    TimeObj.newTime = n;
    TimeObj.ms = ms;
    return TimeObj
}

function adjust(e) {
    e = e < 10 ? "0" + e : e;
    return e
}
var stoptimer, holdtime, splitArray = [],
    TimeObj = {};
var parentStart = 0;
var newTime = "";
onmessage = function (e) {
    switch (e.data) {
    case "start":
        splitArray = [];
        parentStart = (new Date).getTime();
        StopWorker.start(parentStart);
        break;
    case "stop":
        postMessage("splt_" + TimeObj.newTime + " : " + TimeObj.ms);
        splitArray = [];
        clearInterval(stoptimer);
        break;
    case "reset":
        clearInterval(stoptimer);
        splitArray = [];
        postMessage("tim_00 : 00 : 00_ 000");
        break;
    case "hold":
        holdtime = (new Date).getTime();
        clearInterval(stoptimer);
        break;
    case "cont":
        StopWorker.cont(parentStart);
        break;
    case "split":
        splitArray.push(TimeObj.newTime + " : " + TimeObj.ms);
        postMessage("splt_" + splitArray[splitArray.length - 1]);
        break
    }
};
var StopWorker = {
    start: function (e) {
        clearInterval(stoptimer);
        stoptimer = setInterval(function () {
            var t = milliTOtime((new Date).getTime() - e);
            postMessage("tim_" + t.newTime + "_" + t.ms)
        }, 1);
    },
    cont: function (e) {
        var t = (new Date).getTime() - holdtime;
        stoptimer = setInterval(function () {
            var n = milliTOtime((new Date).getTime() - t - e);
            postMessage("tim_" + n.newTime + "_" + n.ms)
        }, 1);
    }
}