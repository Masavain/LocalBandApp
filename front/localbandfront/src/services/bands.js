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
  return response.data
}


export default { getAll , createNew, setToken, update }