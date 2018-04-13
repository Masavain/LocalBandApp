import bandService from '.././services/bands'

const bandReducer = (state = [], action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'INIT_BANDS':
    return action.data
  case 'UPDATE':
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

export const updateBand = (updatedBand) => {
  return async (dispatch) => {
    dispatch({
      type: 'UPDATE',
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