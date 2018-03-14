import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import bandReducer from './reducers/bandReducer'

const reducer = combineReducers({
  bands: bandReducer
})
const store = createStore(reducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store