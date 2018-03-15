import loginService from '.././services/login'
import bandService from '.././services/bands'

const loginReducer = (state = null, action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'LOGIN':
    return action.user
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({
      username: username,
      password: password
    })

    bandService.setToken(user.token)
    window.localStorage.setItem('loggedUser', JSON.stringify(user))

    dispatch({
      type: 'LOGIN',
      user: user.username
    })

  }

}

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedUser')
    dispatch({
      type: 'LOGOUT'
    })
  }
}

export const initUser = () => {
  return async (dispatch) => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      dispatch({
        type: 'LOGIN',
        user: user.username
      })
    } else {
      dispatch({
        type: 'LOGIN',
        user: null
      })
    }
  }
}


export default loginReducer