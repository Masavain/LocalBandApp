import axios from 'axios'
const url = 'http://localhost:3001/api/images'
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const postImgur = async ( image ) => {
  const clientId = '51812115fbf0164'
  const config = {
    headers: { 'authorization': 'Client-ID ' + clientId }
  }
  const response = await axios.post('https://api.imgur.com/3/image', { image }, config)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${url}/${id}`)
  return response.data
}

const postAlbumArt = async (newObject) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(`${url}/albumart`, newObject, config)
  return response.data
}

const postHeadArt = async (newObject) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(`${url}/postimage`, newObject, config)
  return response.data
}

const postImage = async (newObject) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(url, newObject, config)
  return response.data
}

export default { setToken, getAll, getById, postImgur, postImage, postAlbumArt, postHeadArt }