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

export async function sendMessageApi(messageDto) {
  const response = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageDto),
  })
  return parseResponse(response)
}

export async function fetchNewMessagesApi(userId) {
  const params = new URLSearchParams({ userId })
  const response = await fetch(`${API_BASE_URL}/fetch/new/messages?${params.toString()}`)
  return parseResponse(response)
}

export async function fetchMessagesBetweenUsersApi(senderId, receiverId) {
  const params = new URLSearchParams({
    senderId,
    receiverId,
    userId1: senderId,
    userId2: receiverId,
  })
  const response = await fetch(`${API_BASE_URL}/fetch/messages?${params.toString()}`)
  return parseResponse(response)
}
