(function () {
    "use strict";

    var methods, generateNewMethod, i, j, cur, old, addEvent;

    if ("console" in window) {
    	var consoleElement = document.getElementById("console");
    	
        methods = [
            "log", "assert", "clear", "count",
            "debug", "dir", "dirxml", "error",
            "exception", "group", "groupCollapsed",
            "groupEnd", "info", "profile", "profileEnd",
            "table", "time", "timeEnd", "timeStamp",
            "trace", "warn"
        ];

        generateNewMethod = function (oldCallback, methodName) {
            return function () {
                var args;
                //alert("called console." + methodName + ", with " + arguments.length + " argument(s)");
                args = Array.prototype.slice.call(arguments, 0);
                document.getElementById("console").innerHTML += "<div class=\"logEntry\"><div class=\"left " + methodName + "\">&gt;</div><div class=\"right " + methodName + "\">" + args + "</div></div>";
                document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight;
                Function.prototype.apply.call(oldCallback, console, arguments);
            };
        };

        for (i = 0, j = methods.length; i < j; i++) {
            cur = methods[i];
            if (cur in console) {
                old = console[cur];
                console[cur] = generateNewMethod(old, cur);
            }
        }
    }

    window.onerror = function (msg, url, line) {
        alert("Window error: " + msg + ", " + url + ", line " + line);
    };
}());
