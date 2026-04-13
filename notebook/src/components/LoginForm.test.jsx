import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

test('<LoginForm /> updates User state and calls onSubmit', async() => {
  const loginUser = vi.fn()
  render(<LoginForm loginUser={loginUser}/>)

  const username = screen.getByLabelText('Username')
  // screen.debug(username)
  const password = screen.getByLabelText('Password')
  const user = userEvent.setup()
  // screen.debug(password)
  await user.type(username, 'admin')
  await user.type(password, '1234')

  const Login = screen.getByText('Login')
  // screen.debug(Login)
  await user.click(Login)

  expect(loginUser.mock.calls).toHaveLength(1)
})