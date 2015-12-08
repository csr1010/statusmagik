if (typeof Worker !== "undefined") {
    if (typeof myWorker == "undefined") {
        var myWorker = new Worker("js/worker.js")
    }
} else {
    alert("it was designed to work in IE 10 + browsers or chrome/ff/safari/opera,,,so please upgrade urself")
}
var stopModule = function () {
    var e = {
        init: function () {
            window.holdContStatus = "hold";
            window.startFlag = false;
            window.strtevent = document.getElementById("startButton");
            window.stopevent = document.getElementById("stopbutton");
            window.holdevent = document.getElementById("holdbutton");
            window.rstevent = document.getElementById("resetbutton");
            window.splitevnt = document.getElementById("splitbutton");
            window.stopWatch = document.getElementById("stopWatch");
            window.milsecs = document.getElementById("milsecs")
        },
        split: function () {
            if (startFlag && holdContStatus == "hold") myWorker.postMessage("split")
        },
        reset: function () {
            this.deleteRow("stopTable");
            startFlag = false;
            myWorker.postMessage("reset");
            if (holdContStatus != "hold") {
                holdevent.innerHTML = "<i class='glyphicon glyphicon-pause'></i> Hold";
                holdContStatus = "hold"
            }
        },
        start: function () {
            this.deleteRow("stopTable");
            startFlag = true;
            myWorker.postMessage("start");
            if (holdContStatus != "hold") {
                holdevent.innerHTML = "<i class='glyphicon glyphicon-pause'></i> Hold";
                holdContStatus = "hold"
            }
        },
        stop: function () {
            startFlag = false;
            myWorker.postMessage("stop");
            if (holdContStatus != "hold") {
                holdevent.innerHTML = "<i class='glyphicon glyphicon-pause'></i> Hold";
                holdContStatus = "hold"
            }
        },
        hold: function () {
            if (startFlag) {
                if (holdContStatus == "hold") {
                    holdevent.innerHTML = "<i class='glyphicon glyphicon-play'></i> continue";
                    holdContStatus = "cont";
                    myWorker.postMessage("hold")
                } else {
                    holdevent.innerHTML = "<i class='glyphicon glyphicon-pause'></i> Hold";
                    holdContStatus = "hold";
                    myWorker.postMessage("cont")
                }
            }
        },
        addRow: function (e, t) {
            var n = document.getElementById(e);
            var r = n.rows.length;
            var i = n.insertRow(r);
            var s = i.insertCell(0);
            var o = document.createElement("input");
            o.type = "text";
            o.className = "form-control";
            o.value = r + 1;
            s.appendChild(o);
            var u = i.insertCell(1);
            u.innerHTML = t;
            u.className = "timer"
        },
        deleteRow: function (e) {
            var t = document.getElementById(e);
            var n = t.rows.length;
            for (var r = 0; r < n; r++) {
                t.deleteRow(r);
                n--;
                r--
            }
        },
        eventdelgt: function () {
            splitevnt.addEventListener("click", function () {
                stopModule.split()
            }, false);
            rstevent.addEventListener("click", function () {
                stopModule.reset()
            }, false);
            strtevent.addEventListener("click", function () {
                stopModule.start()
            }, false);
            stopevent.addEventListener("click", function () {
                stopModule.stop()
            }, false);
            holdevent.addEventListener("click", function () {
                stopModule.hold()
            }, false);
            myWorker.addEventListener("message", function (e) {
                if (e.data.split("_")[0] == "tim") {
                    stopWatch.innerHTML = e.data.split("_")[1];
                    milsecs.innerHTML = e.data.split("_")[2]
                } else if (e.data.split("_")[0] == "splt") stopModule.addRow("stopTable", e.data.split("_")[1])
            }, false)
        }
    };
    return e
}();
stopModule.init();
stopModule.eventdelgt()