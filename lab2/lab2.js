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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var state = {
    initState: "0",
    finalState: ["2", "3"],
    translateMatrix: [
        [null, "a", null, null],
        [null, null, "b", "c"],
        [null, null, null, null],
        [null, null, null, null]
    ]
};
function getSetOfStates(state) {
    var finalState = state.finalState;
    var setOfStates = [];
    for (var i = 1; i < parseInt(finalState[0]); i++) {
        setOfStates.push("".concat(i));
    }
    return setOfStates;
}
function getAllStates(state) {
    var allStates = [];
    for (var i = 0; i <= parseInt(state.finalState[0]); i++) {
        allStates.push("".concat(i));
    }
    return allStates;
}
function getRegex(state) {
    var regex = deletingStates(state)[0].slice(-1).join();
    for (var i = regex.length; i >= 0; i--) {
        if (regex.includes("ε") || regex.includes("(null)*")) {
            regex = regex.replace("ε", "");
            regex = regex.replace("(null)*", "");
        }
    }
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
    // console.log(finalState)
    //получить каждое финальное состояние
    //в каждое финальное пушить эпс
    //вернуть новое состояние с одним финальным
    var newState = __assign({}, state);
    var newFinalState = [];
    // console.log(finalState.length)
    for (var i = 0; i < state.finalState.length; i++) {
        matrixTransition[parseInt(finalState[i])].push("ε");
    }
    // console.log(matrixTransition[matrixTransition.length - 1])
    for (var i = 0; i < matrixTransition.length - 1; i++) {
        if (matrixTransition[i].length != matrixTransition[matrixTransition.length - 1].length) {
            matrixTransition[i].push(null);
        }
    }
    // console.log(matrixTransition)
    if (matrixTransition.length != matrixTransition[0].length) {
        for (var i = 0; i < matrixTransition[0].length; i++) {
            newFinalState.push(null);
        }
    }
    // console.log(newFinalState)
    matrixTransition.push(newFinalState);
    newState.finalState = matrixTransition.indexOf(newFinalState).toString();
    // console.log(typeof(matrixTransition.indexOf(newFinalState)))
    return newState;
}
function deletingStates(state) {
    var transitionMatrix = state.translateMatrix;
    var interStates = getSetOfStates(state);
    var allStates = getAllStates(state);
    for (var _i = 0, interStates_1 = interStates; _i < interStates_1.length; _i++) {
        var states = interStates_1[_i];
        for (var _a = 0, allStates_1 = allStates; _a < allStates_1.length; _a++) {
            var i = allStates_1[_a];
            if (i == states)
                continue;
            //цикл в себя
            if (state.translateMatrix[i][states] != null && state.translateMatrix[states][i] != null) {
                if (transitionMatrix[i][i] == null) {
                    transitionMatrix[i][i] = state.translateMatrix[i][states] + "(" + state.translateMatrix[states][states] + ")*" + state.translateMatrix[states][i];
                }
                else {
                    transitionMatrix[i][i] = transitionMatrix[i][i] + "|" + state.translateMatrix[i][states] + "(" + state.translateMatrix[states][states] + ")*" + state.translateMatrix[states][i];
                }
            }
            for (var _b = 0, allStates_2 = allStates; _b < allStates_2.length; _b++) {
                var j = allStates_2[_b];
                if (i == states || j == states || i <= j)
                    continue;
                //путь вперед
                if (state.translateMatrix[i][states] != null && state.translateMatrix[states][j] != null) {
                    if (transitionMatrix[i][j] == null) {
                        transitionMatrix[i][j] = state.translateMatrix[i][states] + "(" + state.translateMatrix[states][states] + ")*" + state.translateMatrix[states][j];
                    }
                    else {
                        transitionMatrix[i][j] = transitionMatrix[i][j] + "|" + state.translateMatrix[i][states] + "(" + state.translateMatrix[states][states] + ")*" + state.translateMatrix[states][j];
                    }
                }
                //путь назад
                if (state.translateMatrix[states][i] != null && state.translateMatrix[j][states] != null) {
                    if (transitionMatrix[j][i] == null) {
                        transitionMatrix[j][i] = transitionMatrix[j][states] + "(" + transitionMatrix[states][states] + ")*" + transitionMatrix[states][i];
                    }
                    else {
                        transitionMatrix[j][i] = transitionMatrix[j][i] + "|" + transitionMatrix[j][states] + "(" + transitionMatrix[states][states] + ")*" + transitionMatrix[states][i];
                    }
                }
            }
        }
        for (var _c = 0, allStates_3 = allStates; _c < allStates_3.length; _c++) {
            var i = allStates_3[_c];
            state.translateMatrix[states][i] = null;
            state.translateMatrix[i][states] = null;
        }
    }
    return transitionMatrix;
}
function main() {
    var initState = state.initState;
    var finalState = state.finalState;
    var matrixTransition = state.translateMatrix;
    var zeroState = matrixTransition[0];
    var newState = __assign({}, state);
    // console.log(creatingEpsInitState(state))
    if (state.finalState.length > 1) {
        newState = creatingEpsFinalstate(state);
    }
    else {
        for (var i = 0; i < matrixTransition.length; i++) {
            if (matrixTransition[i][parseInt(newState.finalState[0])] != null && matrixTransition[i][parseInt(newState.finalState[0])] != "ε") {
                creatingEpsFinalstate(newState);
                newState.finalState[0] = "".concat((parseInt(newState.finalState[0]) + 1));
                state = newState;
            }
            else {
                continue;
            }
        }
    }
    var counterFinalState = __spreadArray([], newState.finalState, true);
    for (var i = 0; i < zeroState.length; i++) {
        if (zeroState[i] != null || zeroState[i] != "ε") {
            newState.translateMatrix = creatingEpsInitState(state);
            counterFinalState[0] = (parseInt(newState.finalState[0]) + 1).toString();
            newState.finalState = counterFinalState;
            break;
        }
    }
    console.log(getRegex(newState));
    //  (creatingEpsFinalstate(state))
    // console.log(newState)
    // console.log(creatingEpsFinalstate(state))
}
main();
