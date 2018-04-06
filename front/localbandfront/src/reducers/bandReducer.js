import bandService from '.././services/bands'

const bandReducer = (state = [], action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'INIT_BANDS':
    return action.data
  case 'ADD_ABOUT':
    return [ ...state.filter(b => b.id !==action.data.id), action.data ]
  case 'ADD_BANDCAMP':
    return [ ...state.filter(b => b.id !==action.data.id), action.data ]
  case 'ADD_AVATAR':
    return [ ...state.filter(b => b.id !==action.data.id), action.data ]
  case 'CREATE':
    return [ ...state, action.content]
  default:
    return state
  }

}

export const creation = (newBand) => {
  return async (dispatch) => {
    dispatch({
      type: 'CREATE',
      content: newBand
    })
  }
}

export const addAbout = (updatedBand) => {
  return async (dispatch) => {
    dispatch({
      type: 'ADD_ABOUT',
      data: updatedBand
    })
  }
}

export const addBandcamp = (updatedBand) => {
  return async (dispatch) => {
    dispatch({
      type: 'ADD_BANDCAMP',
      data: updatedBand
    })
  }
}

export const addAvatar = (updatedBand) => {
  return async (dispatch) => {
    dispatch({
      type: 'ADD_AVATAR',
      data: updatedBand
    })
  }
}

export const initialization = () => {
  return async (dispatch) => {
    const bands = await bandService.getAll()
    dispatch({
      type: 'INIT_BANDS',
      data: bands
    })
  }
}

export default bandReducer