import axios from 'axios'
const url = '/api/users'

const getAll = async () => {
  const request = axios.get(url)
  return request.then(response => response.data)
}

const getById = async (id) => {
  const response = await axios.get(`${url}/${id}`)
  return response.data
}

const sign = async (newObject) => {
  const response = await axios.post(url, newObject)
  return response.data
}

export default { getAll, sign, getById }