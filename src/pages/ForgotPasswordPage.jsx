import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!identifier || !otp) {
      return
    }
    setMessage('OTP verified (demo only). Please set a new password in backend flow.')
  }

  return (
    <div className="page-wrap">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <p className="helper-text">Use username/email and OTP received through email.</p>

        <label>
          Username or Email
          <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required />
        </label>
        <label>
          OTP
          <input value={otp} onChange={(event) => setOtp(event.target.value)} required />
        </label>

        <button type="submit">Verify OTP</button>
        {message ? <p className="helper-text">{message}</p> : null}

        <p className="row-link">
          <button
            type="button"
            className="link-button"
            onClick={() => {
              navigate('/login')
            }}
          >
            Back to login
          </button>
        </p>
        <p className="row-link">
          New user? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  )
}

export default ForgotPasswordPage
