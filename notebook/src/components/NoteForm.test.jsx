import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteForm from './NoteForm'

test('<NoteForm /> updates Notes state and calls onSubmit', async() => {
  const createNote = vi.fn()
  const showError = vi.fn()

  render(<NoteForm createNote={createNote} showError={showError}/>)
  const user = userEvent.setup()
  const input = screen.getByPlaceholderText('add a new note...')

  const saveButton = screen.getByText('Save')
  await user.type(input, 'Testing')

  await user.click(saveButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(showError.mock.calls).toHaveLength(0)
  expect(createNote.mock.calls[0][0].content).toBe('Testing')
})

test('<NoteForm /> shows error content is less than 5 characters', async() => {
  const showError = vi.fn()
  const createNote = vi.fn()
  render(<NoteForm showError={showError} createNote={createNote} />)

  const user = userEvent.setup()
  const input = screen.getByPlaceholderText('add a new note...')
  const saveButton = screen.getByText('Save')
  await user.type(input, 'hey')
  await user.click(saveButton)

  expect(createNote.mock.calls).toHaveLength(0)
  expect(showError.mock.calls).toHaveLength(1)
  expect(showError.mock.calls[0][0]).toBe('content should be at least 5 characters')
})