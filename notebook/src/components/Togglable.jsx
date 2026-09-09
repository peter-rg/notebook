import { useState, useImperativeHandle } from 'react'

export default function Togglable(props) {
  const { ref, label, children } = props
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenInvisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(ref, () => {return { toggleVisibility }})

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{label}</button>
      </div>
      <div style={showWhenInvisible}>
        {children}
        <button onClick={toggleVisibility}>
          Cancel
        </button>
      </div>
    </div>
  )
}
