import axios from 'axios'
const url = 'http://localhost:3001/api/bands'

let token = null

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}
const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
const createNew = async (newObject) => {
  const config = {
    headers: { 'Authorization': token }
  }

  const response = await axios.post(url, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${url}/${id}`, newObject)
  console.log('tässä')
  return response.data
}

const postBC = async (id, BCurl) => {
  const response = await axios.post(`${url}/${id}/bandcamp`, BCurl)
  return response.data
}

const postAvatar = async (id, file) => {

  // const files = document.getElementById('INPUT_TAG').files
  const formData = new FormData()
  formData.append('image', file)
  const response = await axios.post(`${url}/${id}/addAvatar`, formData)
  return response.data
}


export default { getAll , createNew, setToken, update, postBC, postAvatar }