import {States, getAllStates, getSetOfStates} from "./lab2.js"
export function deleteBrackets(a: string) {
    let result = ''
    if (a[0] == "(") {
        if (a[3] == "*") {
            result = a[1] + a[3]
        } else { return a }
    }
    else { return a }
    return result
  }

  export function exchangePlaces(state: States){
    let interStates = getSetOfStates(state)
    let allStates = getAllStates(state)
    let transitionMatrix = state.translateMatrix
    let counter = 0
    let interstatesSorted = []
    let arrSorted = []
    for(let i of interStates){
        for(let j of allStates){
            if(transitionMatrix[i][j] != null){
                 counter += 1
            }
        }
        interstatesSorted[i - 1] = counter
        counter = 0
    }
    arrSorted = [...interstatesSorted]
    interstatesSorted = interstatesSorted.sort((a, b)=> a - b)
    let result:any = []
    for(let i = 0; i < interstatesSorted.length; i++){
        result.push(arrSorted.indexOf(interstatesSorted[i]) + 1)
    }
    
   
    return result
  }
  