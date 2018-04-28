import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import bandReducer from './reducers/bandReducer'
import loginReducer from './reducers/loginReducer'
import toggleReducer from './reducers/toggleReducer'
import postReducer from './reducers/postReducer'
import notificationReducer from './reducers/notificationReducer'

const reducer = combineReducers({
  bands: bandReducer,
  user: loginReducer,
  toggle: toggleReducer,
  posts: postReducer,
  notification: notificationReducer
})
const store = createStore(reducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store