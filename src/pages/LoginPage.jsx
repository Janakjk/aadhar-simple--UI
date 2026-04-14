import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

function LoginPage() {
  const navigate = useNavigate()
  const { login, hasKeycloakConfig, error } = useAuth()

  const handleKeycloakLogin = async () => {
    await login()
    navigate('/chat')
  }

  return (
    <div className="page-wrap">
      <div className="card form-card">
        <h1>Login</h1>
        <p className="helper-text">Sign in with Keycloak to continue.</p>

        <button type="button" className="secondary" onClick={handleKeycloakLogin}>
          Login with Keycloak
        </button>

        {!hasKeycloakConfig ? (
          <p className="helper-text">
            Keycloak is not configured for this environment yet. Please contact admin.
          </p>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        <p className="row-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="row-link">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
