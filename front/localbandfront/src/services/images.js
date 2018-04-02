import axios from 'axios'


const postImgur = async ( image ) => {
  console.log('täällä metodissa', image)
  const clientId = '51812115fbf0164'
  const config = {
    headers: { 'authorization': 'Client-ID ' + clientId }
  }
  const response = await axios.post('https://api.imgur.com/3/image', { image }, config)
  return response.data
}

export default { postImgur }