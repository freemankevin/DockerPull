import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, AlertCircle } from 'lucide-react'
import { useNotification } from './NotificationContext'

export function NotificationBell() {
  const { notifications, removeNotification, clearNotifications } = useNotification()
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="notification-wrapper" ref={notificationRef}>
      <button
        className="btn btn-ghost notification-btn"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={16} />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>
      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={clearNotifications}
              >
                Clear all
              </button>
            )}
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div key={notification.id} className={`notification-item notification-${notification.type}`}>
                  <div className="notification-content">
                    {notification.type === 'success' && <Check size={14} />}
                    {notification.type === 'error' && <AlertCircle size={14} />}
                    <span>{notification.message}</span>
                  </div>
                  <button
                    className="notification-close"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}