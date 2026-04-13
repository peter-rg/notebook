import { useState } from 'react'

const LoginForm = ({ loginUser }) => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()

    const newUser = {
      username,
      password
    }
    loginUser(newUser)
    setUserName('')
    setPassword('')
  }
  return <form onSubmit={login}>
    <div>
      <h2>Login:</h2>
      <label>
        Username
        <input type="text" value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
    </div>
    <div>
      <label>
        Password
        <input type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
    </div>
    <button type='submit' style={{ backgroundColor: 'light-green' }}>Login</button>
  </form>
}

export default LoginForm