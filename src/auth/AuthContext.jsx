import Keycloak from 'keycloak-js'
import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './useAuth.js'

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

const hasKeycloakConfig = Object.values(keycloakConfig).every(Boolean)
const keycloak = hasKeycloakConfig ? new Keycloak(keycloakConfig) : null

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(hasKeycloakConfig)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!keycloak) {
      return
    }

    keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((isAuthenticated) => {
        setAuthenticated(isAuthenticated)
        setUser(isAuthenticated ? keycloak.tokenParsed : null)
      })
      .catch(() => {
        setError('Unable to initialize Keycloak.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = () => {
    if (!keycloak) {
      setAuthenticated(true)
      setUser({ preferred_username: 'local-user' })
      return Promise.resolve()
    }
    return keycloak.login()
  }

  const logout = () => {
    if (!keycloak) {
      setAuthenticated(false)
      setUser(null)
      return Promise.resolve()
    }
    return keycloak.logout({ redirectUri: window.location.origin + '/login' })
  }

  const value = useMemo(
    () => ({
      loading,
      authenticated,
      user,
      error,
      hasKeycloakConfig,
      login,
      logout,
    }),
    [loading, authenticated, user, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
