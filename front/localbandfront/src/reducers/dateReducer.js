
const dateReducer = (state = null, action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'SET_DATE':
    return  action.date
  case 'CLEAR_DATE':
    return null
  default:
    return state
  }
}

export const setDate = (date) => {
  return {
    type: 'SET_DATE',
    date
  }
}

export const clearDate = () => {
  return {
    type: 'CLEAR_DATE',
  }
}

export default dateReducer