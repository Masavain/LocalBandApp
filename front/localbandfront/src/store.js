import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import bandReducer from './reducers/bandReducer'
import loginReducer from './reducers/loginReducer'
import filterReducer from './reducers/filterReducer'
const reducer = combineReducers({
  bands: bandReducer,
  user: loginReducer,
  filter: filterReducer
})
const store = createStore(reducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store