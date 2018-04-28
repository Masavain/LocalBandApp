const notificationReducer = (state = { message: '', visible: false }, action) => {
  console.log('ACTION', action)
  switch (action.type) {
  case 'NEW_NOTIF':
    return { message: action.notif, visible: true }
  case 'DELETE_NOTIF':
    return { message: '', visible: false }
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
        type: 'DELETE_NOTIF',
      })
    }, 1000*seconds)
  }
}


export default notificationReducer