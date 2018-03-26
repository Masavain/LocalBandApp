const initial = { filter: '', filterType: 'name' }

const filterReducer = (state = initial, action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'SET_FILTER':
    return { ...state, filter: action.filter }
  case 'SET_FILTERTYPE':
    return { ...state, filterType: action.filterType }
  default:
    return state
  }
}

export const filterChange = (filter) => {
  return {
    type: 'SET_FILTER',
    filter
  }
}

export const filtertypeChange = (filterType) => {
  return {
    type: 'SET_FILTERTYPE',
    filterType
  }
}

export default filterReducer