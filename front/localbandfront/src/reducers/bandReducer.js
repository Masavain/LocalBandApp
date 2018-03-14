import bandService from '.././services/bands'

const bandReducer = (state = [], action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'INIT_BANDS':
    return action.data
  case 'CREATE':
    return [ ...state, action.content]
  default:
    return state
  }

}

export const creation = (content) => {
  return async (dispatch) => {
    const newAnec = await bandService.createNew(content)
    dispatch({
      type: 'CREATE',
      content: newAnec
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