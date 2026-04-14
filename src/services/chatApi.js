const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

function getAuthHeaders(accessToken) {
  if (!accessToken) {
    throw new Error('Missing Keycloak access token.')
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

export async function sendMessageApi(messageDto, accessToken) {
  const response = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(accessToken),
    },
    body: JSON.stringify(messageDto),
  })
  return parseResponse(response)
}

export async function fetchNewMessagesApi(userId, accessToken) {
  const params = new URLSearchParams({ userId })
  const response = await fetch(`${API_BASE_URL}/fetch/new/messages?${params.toString()}`, {
    headers: {
      ...getAuthHeaders(accessToken),
    },
  })
  return parseResponse(response)
}

export async function fetchMessagesBetweenUsersApi(senderId, receiverId, accessToken) {
  const params = new URLSearchParams({
    senderId,
    receiverId,
    userId1: senderId,
    userId2: receiverId,
  })
  const response = await fetch(`${API_BASE_URL}/fetch/messages?${params.toString()}`, {
    headers: {
      ...getAuthHeaders(accessToken),
    },
  })
  return parseResponse(response)
}
