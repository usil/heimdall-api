/*
https://github.com/IYAHU/override-console-log/blob/master/index.js
https://github.com/sunnykgupta/jsLogger/blob/master/jsLogger.js
*/

function AdvancedLog() {

    this.config = (options) => {
        const origlog = console.log;
        if (typeof options === "undefined") {
            options = {};
        }

        var safeOptions = {
            logLevel: options.logLevel || "info",
            dateFormat: options.dateFormat || "toLocaleString"
        }

        const getCurrentDateFormat = function() {
            var dateStr;
            if (safeOptions && safeOptions.dateFormat && typeof safeOptions.dateFormat === 'string') {
                switch (safeOptions.dateFormat.toLowerCase()) {
                    case 'todatestring':
                        dateStr = (new Date()).toDateString();
                        break;
                    case 'togmtstring':
                        dateStr = (new Date()).toGMTString();
                        break;
                    case 'toisostring':
                        dateStr = (new Date()).toISOString();
                        break;
                    case 'tojson':
                        dateStr = (new Date()).toJSON();
                        break;
                    case 'tolocaledatestring':
                        dateStr = (new Date()).toLocaleDateString();
                        break;
                    case 'todatestring':
                        dateStr = (new Date()).toLocaleTimeString();
                        break;
                    case 'tostring':
                        dateStr = (new Date()).toString();
                        break;
                    case 'totimestring':
                        dateStr = (new Date()).toTimeString();
                        break;
                    case 'toutcstring':
                        dateStr = (new Date()).toUTCString();
                        break;
                    case 'tolocalestring':
                        dateStr = new Date().toLocaleString(); // default date format
                        break;
                    default:
                        dateStr = (new Date()).toLocaleString();
                        break;
                }
            }
            return dateStr + ' ';
        };

        console.log = function(obj, ...argumentArray) {
            var dateString = getCurrentDateFormat();
            argumentArray.unshift(obj);
            argumentArray.unshift("INFO");
            argumentArray.unshift(dateString);
            origlog.apply(this, argumentArray);
        };

        console.debug = function(obj, ...argumentArray) {
            if (safeOptions.logLevel != "debug") return;
            var dateString = getCurrentDateFormat();
            argumentArray.unshift(obj);
            argumentArray.unshift("DEBUG");
            argumentArray.unshift(dateString);
            origlog.apply(this, argumentArray);
        };

        console.error = function(obj, ...argumentArray) {
            var dateString = getCurrentDateFormat();
            argumentArray.unshift(obj);
            argumentArray.unshift("ERROR");
            argumentArray.unshift(dateString);
            origlog.apply(this, argumentArray);
        };

        console.log('AdvancedLog was loaded');
        console.log('AdvancedLog options');
        console.log(safeOptions);
    }

    function getCalleeInfo() {
        var stack = new Error().stack.split("at ");
        var functionInfo = "" + stack[4].trim();
        var fileLocation = functionInfo.substring(functionInfo.indexOf("(") + 1, functionInfo.indexOf(":"));
        var lineInfo = functionInfo.split(":");
        return {
            location: fileLocation,
            line: lineInfo[1]
        };
    }
};

module.exports = AdvancedLog;