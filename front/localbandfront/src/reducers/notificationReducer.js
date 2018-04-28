const notificationReducer = (state = { message: '', visible: false }, action) => {
  console.log('ACTION', action)
  switch (action.type) {
  case 'NEW_NOTIF':
    return { message: action.notif, visible: true }
  case 'DELETE_MESSAGE':
    return { message: '', visible: state.visible }
  case 'HIDE_VISIBLE':
    return { message: state.message, visible: false }
  default:
    return state
  }
}

export const notify = (notif, seconds) => {
  return async (dispatch) => {
    dispatch({
      type: 'NEW_NOTIF',
      notif
    })
    setTimeout(() => {
      dispatch({
        type: 'HIDE_VISIBLE',
      })
    }, 1000*seconds)
    setTimeout(() => {
      dispatch({
        type: 'DELETE_MESSAGE',
      })
    }, 2000*seconds)
  }
}


export default notificationReducer