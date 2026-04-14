import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import {
  fetchMessagesBetweenUsersApi,
  fetchNewMessagesApi,
  sendMessageApi,
} from '../services/chatApi.js'

const USERS = ['Aarav', 'Diya', 'Vikram', 'Maya', 'Priya']

function ChatPage() {
  const navigate = useNavigate()
  const { logout, user, authenticated, getAccessToken } = useAuth()
  const [activeUser, setActiveUser] = useState(USERS[0])
  const [chatInput, setChatInput] = useState('')
  const [messagesByUser, setMessagesByUser] = useState({})
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [apiStatus, setApiStatus] = useState('')
  const currentUserId = user?.sub || user?.preferred_username || ''

  const activeMessages = useMemo(
    () => messagesByUser[activeUser] ?? [],
    [messagesByUser, activeUser],
  )

  const toTextMessage = useCallback((item) => {
    if (typeof item === 'string') {
      return item
    }
    if (item && typeof item === 'object') {
      const sender = item.senderId || 'Unknown'
      const message = item.message || JSON.stringify(item)
      return `${sender}: ${message}`
    }
    return String(item)
  }, [])

  const mergeMessages = useCallback((userId, data) => {
    const list = Array.isArray(data) ? data : data ? [data] : []
    const mapped = list.map(toTextMessage)
    setMessagesByUser((prev) => ({
      ...prev,
      [userId]: Array.from(new Set([...(prev[userId] ?? []), ...mapped])),
    }))
  }, [toTextMessage])

  const sendMessage = async () => {
    if (!authenticated) {
      setApiStatus('You are not authenticated with Keycloak.')
      return
    }
    if (!currentUserId) {
      setApiStatus('No Keycloak user id found. Please login again.')
      return
    }
    if (!chatInput.trim()) {
      return
    }
    const messageToSend = chatInput.trim()
    const messageDto = {
      senderId: currentUserId,
      receiverId: activeUser,
      message: messageToSend,
    }

    setMessagesByUser((prev) => ({
      ...prev,
      [activeUser]: [...(prev[activeUser] ?? []), `You: ${messageToSend}`],
    }))
    setChatInput('')

    try {
      const accessToken = await getAccessToken()
      await sendMessageApi(messageDto, accessToken)
      setApiStatus('Message sent.')
    } catch (err) {
      setApiStatus(
        err instanceof Error
          ? `Message shown locally. Server error: ${err.message}`
          : 'Message shown locally, but failed to send to server.',
      )
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  useEffect(() => {
    let ignore = false

    async function loadNewMessages() {
      if (!currentUserId) {
        return
      }
      try {
        const accessToken = await getAccessToken()
        const data = await fetchNewMessagesApi(currentUserId, accessToken)
        if (!ignore) {
          mergeMessages(activeUser, data)
          setApiStatus('Fetched new messages after login.')
        }
      } catch (err) {
        if (!ignore) {
          setApiStatus(err instanceof Error ? err.message : 'Failed to fetch new messages.')
        }
      }
    }

    loadNewMessages()
    return () => {
      ignore = true
    }
  }, [activeUser, currentUserId, getAccessToken, mergeMessages])

  useEffect(() => {
    let ignore = false

    async function loadConversation() {
      if (!currentUserId) {
        return
      }
      try {
        const accessToken = await getAccessToken()
        const data = await fetchMessagesBetweenUsersApi(currentUserId, activeUser, accessToken)
        if (!ignore) {
          mergeMessages(activeUser, data)
          setApiStatus(`Loaded messages between ${currentUserId} and ${activeUser}.`)
        }
      } catch (err) {
        if (!ignore) {
          setApiStatus(err instanceof Error ? err.message : 'Failed to fetch messages.')
        }
      }
    }

    loadConversation()
    return () => {
      ignore = true
    }
  }, [activeUser, currentUserId, getAccessToken, mergeMessages])

  return (
    <div className="chat-page">
      <aside className="sidebar card">
        <h2>App Menu</h2>
        <p className="helper-text">Chat users</p>
        <ul className="users-list">
          {USERS.map((person) => (
            <li key={person}>
              <button
                type="button"
                className={person === activeUser ? 'user-btn active' : 'user-btn'}
                onClick={() => setActiveUser(person)}
              >
                {person}
              </button>
            </li>
          ))}
        </ul>
        <p className="helper-text">Logged in as {user?.preferred_username || 'user'}</p>
        <p className="helper-text">Current User ID (Keycloak): {currentUserId || 'not available'}</p>
        <button type="button" className="secondary" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="chat-main card">
        <h2>Message Box - {activeUser}</h2>
        <div className="message-box">
          {activeMessages.map((msg, idx) => (
            <div key={`${msg}-${idx}`} className="message-item">
              {msg}
            </div>
          ))}
        </div>
        <div className="message-composer">
          <input
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            placeholder="Type your message..."
          />
          <button type="button" onClick={sendMessage}>
            Send
          </button>
        </div>
        {apiStatus ? <p className="helper-text">{apiStatus}</p> : null}

        <section className="feature-box">
          <h3>Frontend Encryption/Decryption</h3>
          <p className="helper-text">
            Placeholder: message encryption/decryption flow can be plugged into send/receive actions.
          </p>
        </section>

        <section className="feature-box">
          <h3>Aadhaar Verification</h3>
          <div className="verify-row">
            <input
              value={aadhaarNumber}
              onChange={(event) => setAadhaarNumber(event.target.value)}
              placeholder="Enter Aadhaar for verification"
            />
            <button type="button" className="secondary">
              Verify (placeholder)
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ChatPage
