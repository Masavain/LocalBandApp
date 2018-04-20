import postService from './../services/posts'

const postReducer = (state = [], action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
  case 'INIT_POSTS':
    return action.data
  case 'UPDATEPOST':
    return [ ...state.filter(p => p._id !== action.data._id), action.data ]
  case 'CREATEPOST':
    return [ ...state, action.data]
  default:
    return state
  }
}

export const postCreation = (newPost) => {
  return async (dispatch) => {
    dispatch({
      type: 'CREATEPOST',
      data: newPost
    })
  }
}

export const postUpdate = (updatedPost) => {
  return async (dispatch) => {
    dispatch({
      type: 'UPDATEPOST',
      data: updatedPost
    })
  }
}


export const initializePosts = () => {
  return async (dispatch) => {
    const posts = await postService.getAll()
    dispatch({
      type: 'INIT_POSTS',
      data: posts
    })
  }
}
export default postReducer