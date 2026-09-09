import axios from 'axios'

const login = async(user) => {
  const res = await axios.post('/api/login', user)
  return res.data
}

export default login