import loginService from '.././services/login'
import bandService from '.././services/bands'
import imageService from '.././services/images'
import userService from '.././services/users'

console.log('loggedUser:', JSON.parse(window.localStorage.getItem('loggedUser')))
const loginReducer = (state = JSON.parse(window.localStorage.getItem('loggedUser')), action) => {
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

export const sign = (username, password) => {
  return async (dispatch) => {

    const newuser = await userService.sign({
      username: username,
      password: password
    })
    const user = await loginService.login(newuser)

    imageService.setToken(user.token)
    bandService.setToken(user.token)
    window.localStorage.setItem('loggedUser', JSON.stringify(user))

    dispatch({
      type: 'LOGIN',
      user
    })
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({
      username: username,
      password: password
    })
    imageService.setToken(user.token)
    bandService.setToken(user.token)
    window.localStorage.setItem('loggedUser', JSON.stringify(user))

    dispatch({
      type: 'LOGIN',
      user
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
      imageService.setToken(user.token)
      bandService.setToken(user.token)
      dispatch({
        type: 'LOGIN',
        user: user
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