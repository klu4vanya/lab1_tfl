"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var state;
var data = fs.readFileSync('input.txt', 'utf8');
// Разбиваем строки файла
var lines = data.split('\n');
// Получаем размерность матрицы
var n = lines[0].split(',').length;
// Создаем матрицу n*n, заполненную значениями "null"
var translateMatrix = Array.from({ length: n }, function () { return Array(n).fill(null); });
// console.table(translateMatrix)
var initState = lines[1];
var finalState = lines[2].split(",");
for (var i = 3; i < lines.length; i++) {
    var regex = /\((\d+),\s*([^\)]+)\)\s*->\s*(\d+)/;
    var parts = lines[i].match(regex);
    if (parts) {
        var fromState = parseInt(parts[1], 10);
        var inputSymbol = parts[2].trim();
        var toState = parseInt(parts[3], 10);
        translateMatrix[fromState][toState] = inputSymbol;
    }
}
var result = {
    initState: initState,
    finalState: finalState,
    translateMatrix: translateMatrix,
};
state = result;
// console.table(state.translateMatrix)
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
// console.log(deleteBrackets("(ab)*"))
function outOfbrackets(a) {
    if (a.includes("|")) {
        var b = a.split('|');
        var m = b[0].length;
        var n_1 = b[1].length;
        var dp = [];
        for (var i_1 = 0; i_1 <= m; i_1++) {
            dp[i_1] = [];
            for (var j_1 = 0; j_1 <= n_1; j_1++) {
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
        var result_1 = [];
        var i = m, j = n_1;
        while (i > 0 && j > 0) {
            if (b[0][i - 1] === b[1][j - 1]) {
                result_1.unshift(b[0][i - 1]);
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
        var string = result_1.join("");
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
// console.log(findSubstr("a*|a*a(aa*a)*aa*"))
function getSetOfStates(state) {
    var finalState = state.finalState;
    var initState = state.initState;
    var setOfStates = [];
    for (var i = 0; i < state.translateMatrix.length; i++) {
        setOfStates.push(i);
    }
    setOfStates = setOfStates.filter(function (item) { return item != finalState[0] && item != initState; });
    return setOfStates;
}
function getAllStates(state) {
    var allStates = [];
    for (var i = 0; i < state.translateMatrix.length; i++) {
        allStates.push("".concat(i));
    }
    return allStates;
}
function getRegex(state) {
    var regex = deletingStates(state)[0].slice(-1).join();
    for (var i = regex.length; i >= 0; i--) {
        if (regex.includes("ε") || regex.includes("(null)*")) {
            regex = regex.replace("ε", "");
            // regex = regex.replace("(null)*", "")
        }
    }
    // let simplified = regex.replace(/ε+/g, '');
    // simplified = simplified.replace(/ε([a-z])/g, '$1');
    // simplified = simplified.replace(/([a-z])ε/g, '$1');
    return regex;
}
function creatingEpsInitState(state) {
    var matrixTransition = state.translateMatrix;
    var initState = matrixTransition[0];
    var zeroState = [];
    for (var _i = 0, initState_1 = initState; _i < initState_1.length; _i++) {
        var i = initState_1[_i];
        for (var j = 0; j < initState.length + 1; j++) {
            if (j == 1) {
                zeroState.push("ε");
            }
            else {
                zeroState.push(null);
            }
        }
        break;
    }
    matrixTransition.unshift(zeroState);
    for (var i = 1; i < matrixTransition[0].length; i++) {
        matrixTransition[i].unshift(null);
    }
    return matrixTransition;
}
function creatingEpsFinalstate(state) {
    var matrixTransition = state.translateMatrix;
    var finalState = state.finalState;
    var newState = __assign({}, state);
    var newFinalState = [];
    for (var i = 0; i < state.finalState.length; i++) {
        matrixTransition[parseInt(finalState[i])].push("ε");
    }
    for (var i = 0; i < matrixTransition.length - 1; i++) {
        if (matrixTransition[i].length != matrixTransition[i + 1].length) {
            if (matrixTransition[i].length < matrixTransition[i + 1].length) {
                matrixTransition[i].push(null);
            }
            else {
                matrixTransition[i + 1].push(null);
            }
        }
    }
    if (matrixTransition.length != matrixTransition[0].length) {
        for (var i = 0; i < matrixTransition[0].length; i++) {
            newFinalState.push(null);
        }
    }
    matrixTransition.push(newFinalState);
    newState.finalState = matrixTransition.indexOf(newFinalState).toString();
    return newState;
}
function deletingStates(state) {
    var transitionMatrix = state.translateMatrix;
    var interStates = getSetOfStates(state);
    var allStates = getAllStates(state);
    // console.log(interStates, allStates)
    for (var _i = 0, interStates_1 = interStates; _i < interStates_1.length; _i++) {
        var states = interStates_1[_i];
        for (var _a = 0, allStates_1 = allStates; _a < allStates_1.length; _a++) {
            var i = allStates_1[_a];
            if (i == states)
                continue;
            //цикл в себя
            if (state.translateMatrix[i][states] != null && state.translateMatrix[states][i] != null) {
                if (transitionMatrix[i][i] == null) {
                    transitionMatrix[i][i] = state.translateMatrix[i][states] + deleteBrackets("(" + state.translateMatrix[states][states] + ")*") + state.translateMatrix[states][i];
                }
                else {
                    transitionMatrix[i][i] = "(" + transitionMatrix[i][i] + "|" + state.translateMatrix[i][states] + deleteBrackets("(" + state.translateMatrix[states][states] + ")*") + state.translateMatrix[states][i] + ")";
                }
            }
            for (var _b = 0, allStates_2 = allStates; _b < allStates_2.length; _b++) {
                var j = allStates_2[_b];
                if (i == states || j == states || i <= j)
                    continue;
                //путь вперед
                if (state.translateMatrix[i][states] != null && state.translateMatrix[states][j] != null) {
                    if (transitionMatrix[i][j] == null) {
                        transitionMatrix[i][j] = state.translateMatrix[i][states] + deleteBrackets("(" + state.translateMatrix[states][states] + ")*") + state.translateMatrix[states][j];
                    }
                    else {
                        transitionMatrix[i][j] = "(" + transitionMatrix[i][j] + "|" + state.translateMatrix[i][states] + deleteBrackets("(" + state.translateMatrix[states][states] + ")*") + state.translateMatrix[states][j] + ")";
                    }
                }
                //путь назад
                if (state.translateMatrix[states][i] != null && state.translateMatrix[j][states] != null) {
                    if (transitionMatrix[j][i] == null) {
                        transitionMatrix[j][i] = transitionMatrix[j][states] + deleteBrackets("(" + transitionMatrix[states][states] + ")*") + transitionMatrix[states][i];
                    }
                    else {
                        transitionMatrix[j][i] = "(" + transitionMatrix[j][i] + "|" + transitionMatrix[j][states] + deleteBrackets("(" + transitionMatrix[states][states] + ")*") + transitionMatrix[states][i] + ")";
                    }
                }
            }
        }
        for (var _c = 0, allStates_3 = allStates; _c < allStates_3.length; _c++) {
            var i = allStates_3[_c];
            state.translateMatrix[states][i] = null;
            state.translateMatrix[i][states] = null;
        }
        console.log(states);
        console.table(transitionMatrix);
    }
    return transitionMatrix;
}
function main() {
    var matrixTransition = state.translateMatrix;
    var newState = __assign({}, state);
    if (state.finalState.length > 1) {
        newState = creatingEpsFinalstate(state);
    }
    else {
        for (var i = 0; i < newState.translateMatrix.length; i++) {
            if (matrixTransition[parseInt(newState.finalState[0])][i] != null && matrixTransition[parseInt(newState.finalState[0])][i] != "ε") {
                creatingEpsFinalstate(newState);
                newState.finalState[0] = (newState.translateMatrix.length - 1).toString();
                state = newState;
            }
            else {
                continue;
            }
        }
    }
    for (var i = 0; i < matrixTransition.length; i++) {
        if (matrixTransition[i][initState] != null || matrixTransition[i][initState] != "ε") {
            newState.translateMatrix = creatingEpsInitState(state);
            newState.finalState[0] = (newState.translateMatrix.length - 1).toString();
            break;
        }
    }
    // console.table(newState.translateMatrix)
    // console.table(deletingStates(newState))
    console.log(getRegex(newState));
}
main();
