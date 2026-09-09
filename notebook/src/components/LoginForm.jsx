import { useState } from 'react'
import noteService from '../services/notes'
import login from '../services/login'

const LoginForm = ({ setUser, showError }) => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async(event) => {
    event.preventDefault()

    const newUser = {
      username,
      password
    }
    try {
      const savedUser = await login(newUser)
      setUser(savedUser)
      localStorage.setItem('loggedUser', JSON.stringify(savedUser))
      noteService.setToken(savedUser.token)
      setUserName('')
      setPassword('')
    } catch (error) {
      showError(error.response?.data?.error)
    }
  }
  return <form onSubmit={handleLogin}>
    <div>
      <h2>Login</h2>
      <label htmlFor="Username">Username: </label>
      <input type="text" value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="password">Password: </label>
      <input type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <button type='submit' style={{ backgroundColor: 'light-green' }}>Login</button>
  </form>
}

export default LoginForm