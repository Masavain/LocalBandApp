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
const createNew = async (content) => {
  const response = await axios.post(url, { content, votes:0 })
  return response.data
}


export default { getAll , createNew, setToken }