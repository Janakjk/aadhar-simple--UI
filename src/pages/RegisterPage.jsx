import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    aadhaar: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password do not match.')
      return
    }
    setError('')
    navigate('/login')
  }

  return (
    <div className="page-wrap">
      <form className="card form-card" onSubmit={onSubmit}>
        <h1>User Registration</h1>
        <p className="helper-text">Simple registration UI with Aadhaar input.</p>

        <label>
          Username
          <input name="username" value={form.username} onChange={onChange} required />
        </label>
        <label>
          Aadhaar Number
          <input
            name="aadhaar"
            value={form.aadhaar}
            onChange={onChange}
            pattern="[0-9]{12}"
            title="Enter 12 digit Aadhaar number"
            required
          />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit">Register</button>
        <p className="row-link">
          Already registered? <Link to="/login">Go to login</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
