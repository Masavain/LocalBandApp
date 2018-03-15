import loginService from '.././services/login'
import bandService from '.././services/bands'

const loginReducer = (state = null, action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'LOGIN':
    return action.data
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
      data: user
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

export default loginReducer