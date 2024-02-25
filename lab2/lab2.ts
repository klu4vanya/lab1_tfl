import * as fs from 'fs';

interface States {
  initState: string;
  finalState: string[];
  translateMatrix: any;
}
let state: States

const data = fs.readFileSync('input.txt', 'utf8');

// Разбиваем строки файла
const lines = data.split('\n');

// Получаем размерность матрицы
const n = lines[0].split(',').length;

// Создаем матрицу n*n, заполненную значениями "null"
const translateMatrix: (string | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));
// console.table(translateMatrix)
const initState = lines[1]
const finalState = lines[2].split(",")
for (let i = 3; i < lines.length; i++) {
  const regex = /\((\d+),\s*([^\)]+)\)\s*->\s*(\d+)/;
  const parts = lines[i].match(regex);
  if (parts) {
    const fromState = parseInt(parts[1], 10);
    const inputSymbol = parts[2].trim();
    const toState = parseInt(parts[3], 10);

    translateMatrix[fromState][toState] = inputSymbol;
  }
}
const result: States = {
  initState,
  finalState,
  translateMatrix,
};
state = result
// console.table(state.translateMatrix)
function getSetOfStates(state: States) {
  let finalState = state.finalState
  let initState = state.initState
  let setOfStates = []
  for (let i = 0; i < state.translateMatrix.length; i++) {
    setOfStates.push(i)
  }
  setOfStates = setOfStates.filter(item => item != finalState[0] && item != initState)
  return setOfStates
}
function getAllStates(state: States) {
  let allStates = []
  for (let i = 0; i < state.translateMatrix.length; i++) {
    allStates.push(`${i}`)
  }
  return allStates
}
function getRegex(state: States): string {
  let regex: string = deletingStates(state)[0].slice(-1).join()
  for (let i = regex.length; i >= 0; i--) {
    if (regex.includes("ε") || regex.includes("(null)*")) {
      regex = regex.replace("ε", "")
      // regex = regex.replace("(null)*", "")
    }
  }
  // let simplified = regex.replace(/ε+/g, '');
  // simplified = simplified.replace(/ε([a-z])/g, '$1');
  // simplified = simplified.replace(/([a-z])ε/g, '$1');
  return regex
}
function creatingEpsInitState(state: States) {
  let matrixTransition = state.translateMatrix
  let initState = matrixTransition[0]
  let zeroState = []
  for (let i of initState) {
    for (let j = 0; j < initState.length + 1; j++) {
      if (j == 1) {
        zeroState.push("ε")
      } else {
        zeroState.push(null)
      }
    }
    break
  }
  matrixTransition.unshift(zeroState)
  for (let i = 1; i < matrixTransition[0].length; i++) {
    matrixTransition[i].unshift(null)
  }
  return matrixTransition
}
function creatingEpsFinalstate(state: States) {
  let matrixTransition = state.translateMatrix
  let finalState = state.finalState
  let newState: States = { ...state }
  let newFinalState = []
  for (let i = 0; i < state.finalState.length; i++) {
    matrixTransition[parseInt(finalState[i])].push("ε")
  }
  for (let i = 0; i < matrixTransition.length - 1; i++) {
    if (matrixTransition[i].length != matrixTransition[i + 1].length) {
      if (matrixTransition[i].length < matrixTransition[i + 1].length) {
        matrixTransition[i].push(null)
      } else {
        matrixTransition[i + 1].push(null)
      }
    }
  }
  if (matrixTransition.length != matrixTransition[0].length) {
    for (let i = 0; i < matrixTransition[0].length; i++) {
      newFinalState.push(null)
    }
  }
  matrixTransition.push(newFinalState)
  newState.finalState = matrixTransition.indexOf(newFinalState).toString()
  return newState
}
function deletingStates(state: States) {
  let transitionMatrix = state.translateMatrix
  let interStates = getSetOfStates(state)
  let allStates = getAllStates(state)
  console.log(interStates, allStates)
  for (let states of interStates) {
    for (let i of allStates) {
      if (i == states) continue
      //цикл в себя
      if (state.translateMatrix[i][states] != null && state.translateMatrix[states][i] != null) {
        if (transitionMatrix[i][i] == null) {
          transitionMatrix[i][i] = state.translateMatrix[i][states] + "(" + state.translateMatrix[states][states] + ")*" + state.translateMatrix[states][i]
        } else {
          transitionMatrix[i][i] = "(" + transitionMatrix[i][i]  + "|" + state.translateMatrix[i][states] + "(" + state.translateMatrix[states][states] + ")*" + state.translateMatrix[states][i]+ ")"
        }
      }
      for (let j of allStates) {
        if (i == states || j == states || i <= j) continue
        //путь вперед
        if (state.translateMatrix[i][states] != null && state.translateMatrix[states][j] != null) {
          if (transitionMatrix[i][j] == null) {
            transitionMatrix[i][j] = state.translateMatrix[i][states] + "(" + state.translateMatrix[states][states] + ")*" + state.translateMatrix[states][j]
          } else {
            transitionMatrix[i][j] = "(" + transitionMatrix[i][j]  + "|" + state.translateMatrix[i][states] + "(" + state.translateMatrix[states][states] + ")*" + state.translateMatrix[states][j]+ ")"
          }
        }
        //путь назад
        if (state.translateMatrix[states][i] != null && state.translateMatrix[j][states] != null) {
          if (transitionMatrix[j][i] == null) {
            transitionMatrix[j][i] = transitionMatrix[j][states] + "(" + transitionMatrix[states][states] + ")*" + transitionMatrix[states][i]
          } else {
            transitionMatrix[j][i] = "(" + transitionMatrix[j][i]  + "|" + transitionMatrix[j][states] + "(" + transitionMatrix[states][states] + ")*" + transitionMatrix[states][i]+ ")"
          }
        }
      }
    }
    for (let i of allStates) {
      state.translateMatrix[states][i] = null
      state.translateMatrix[i][states] = null
    }
    console.log(states)
    console.table(transitionMatrix)
  }
  return transitionMatrix
}
function main() {
  let matrixTransition = state.translateMatrix
  let newState: States = { ...state }
  if (state.finalState.length > 1) {
    newState = creatingEpsFinalstate(state)
  } else {
    for (let i = 0; i < newState.translateMatrix.length; i++) {
      if (matrixTransition[parseInt(newState.finalState[0])][i] != null && matrixTransition[parseInt(newState.finalState[0])][i] != "ε") {
        creatingEpsFinalstate(newState)
        newState.finalState[0] = (newState.translateMatrix.length - 1).toString()
        state = newState
      } else {
        continue
      }
    }
  }

  for (let i = 0; i < matrixTransition.length; i++) {
    if (matrixTransition[i][initState] != null || matrixTransition[i][initState] != "ε") {
      newState.translateMatrix = creatingEpsInitState(state)
      newState.finalState[0] = (newState.translateMatrix.length - 1).toString()
      break
    }
  }
  // console.table(newState.translateMatrix)
  // console.table(deletingStates(newState))
  console.log(getRegex(newState))
}
main()