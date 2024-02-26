"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSubstr = exports.outOfbrackets = exports.deleteBrackets = void 0;
function deleteBrackets(a) {
    var result = '';
    if (a[0] == "(") {
        if (a[3] == "*") {
            result = a[1] + a[3];
        }
        else {
            return a;
        }
    }
    else {
        return a;
    }
    return result;
}
exports.deleteBrackets = deleteBrackets;
// console.log(deleteBrackets("(ab)*"))
function outOfbrackets(a) {
    if (a.includes("|")) {
        var b = a.split('|');
        var m = b[0].length;
        var n = b[1].length;
        var dp = [];
        for (var i_1 = 0; i_1 <= m; i_1++) {
            dp[i_1] = [];
            for (var j_1 = 0; j_1 <= n; j_1++) {
                if (i_1 === 0 || j_1 === 0) {
                    dp[i_1][j_1] = 0;
                }
                else if (b[0][i_1 - 1] === b[1][j_1 - 1]) {
                    dp[i_1][j_1] = dp[i_1 - 1][j_1 - 1] + 1;
                }
                else {
                    dp[i_1][j_1] = Math.max(dp[i_1 - 1][j_1], dp[i_1][j_1 - 1]);
                }
            }
        }
        var result = [];
        var i = m, j = n;
        while (i > 0 && j > 0) {
            if (b[0][i - 1] === b[1][j - 1]) {
                result.unshift(b[0][i - 1]);
                i--;
                j--;
            }
            else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            }
            else {
                j--;
            }
        }
        var string = result.join("");
        var index1 = b[0].indexOf(string);
        var index2 = b[1].indexOf(string);
        if (index1 !== -1 && index2 !== -1 && index1 + string.length < b[0].length && index2 + string.length < b[1].length) {
            var substr1 = b[0].substring(index1 + string.length);
            var substr2 = b[1].substring(index2 + string.length);
            var finalResult = string + "(" + substr1 + "|" + substr2 + ")";
            return finalResult;
        }
    }
    else {
        return a;
    }
}
exports.outOfbrackets = outOfbrackets;
// console.log(outOfbrackets("a*b|a*a(aa*a)*"))
function findSubstr(a) {
    var b = a.split("|");
    if (b[0] <= b[1]) {
        if (b[1].includes(b[0])) {
            return b[0];
        }
        else {
            return a;
        }
    }
    else {
        if (b[0].includes(b[1])) {
            return b[1];
        }
        else {
            return a;
        }
    }
}
exports.findSubstr = findSubstr;
// console.log(findSubstr("a*|a*a(aa*a)*aa*"))
