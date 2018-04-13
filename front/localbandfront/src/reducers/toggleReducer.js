// * toggle 0 = main, 1 = gallery, 2 = discography *
const toggleReducer = (state = { type: 0 }, action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'TOGGLE':
    return { ...state, type: action.toggle }
  default:
    return state
  }
}

export const toggle = (toggle) => {
  return{
    type: 'TOGGLE',
    toggle
  }
}


export default toggleReducer