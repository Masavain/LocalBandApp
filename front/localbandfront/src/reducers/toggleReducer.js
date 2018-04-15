// * toggle 0 = main, 1 = gallery, 2 = discography *
const toggleReducer = (state = { type: 0, photoIndex: 0, isOpen:false }, action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'TOGGLE':
    return { ...state, type: action.toggle }
  case 'PHOTOINDEX':
    return { ...state, photoIndex: action.index }
  case 'INITPHOTOINDEX':
    return { ...state, photoIndex:0, isOpen:false }
  case 'TOGGLEOPEN':
    return { ...state, isOpen: !state.isOpen }
  case 'OPENFROMINDEX':
    return { ...state, photoIndex:action.index, isOpen: true }
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

export const initiatePhotoIndex = () => {
  return{
    type: 'INITPHOTOINDEX'
  }
}

export const setPhotoIndex = (index) => {
  return{
    type: 'PHOTOINDEX',
    index
  }
}
export const toggleIsOpen = () => {
  return{
    type: 'TOGGLEOPEN'
  }
}

export const openFromIndex = (index) => {
  return{
    type: 'OPENFROMINDEX',
    index
  }
}

export default toggleReducer