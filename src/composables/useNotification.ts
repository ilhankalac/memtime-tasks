import { ref } from 'vue'

export interface Notification {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
}

const notification = ref<Notification | null>(null)

export function useNotification() {
  const showNotification = (message: string, type: Notification['type'] = 'info', timeout = 5000) => {
    notification.value = {
      message,
      type,
      timeout,
    }
  }

  const showSuccess = (message: string, timeout = 3000) => {
    showNotification(message, 'success', timeout)
  }

  const showError = (message: string, timeout = 5000) => {
    showNotification(message, 'error', timeout)
  }

  const clearNotification = () => {
    notification.value = null
  }

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    clearNotification,
  }
}
