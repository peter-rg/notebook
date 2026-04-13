import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Toggable/>', () => {
  beforeEach(() => {
    render(
      <Togglable label='show'>
        <div>Toggable content</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    const element = screen.getByText('Toggable content')
    expect(element).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    const element = screen.getByText('Toggable content')
    expect(element).not.toBeVisible()
  })

  test('after clicking the button children are displayed', async() => {
    const user = userEvent.setup()
    const btn = screen.getByText('show')
    await user.click(btn)
    const element = screen.getByText('Toggable content')
    expect(element).toBeVisible()
  })

  test('toggled content can be closed', async() => {
    const user = userEvent.setup()
    const btn = screen.getByText('show')
    await user.click(btn)

    const button = screen.getByText('Cancel')
    await user.click(button)
    const element = screen.getByText('Toggable content')
    expect(element).not.toBeVisible()
  })
})



