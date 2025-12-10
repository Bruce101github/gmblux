import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Phone,
  MessageCircle,
  Home,
  AlertCircle,
  Check,
  CheckCheck,
  X,
  Bell,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const typeIcons = {
  booking: Calendar,
  contact_inquiry: Phone,
  property_added: Home,
  error: AlertCircle,
};

const typeColors = {
  booking: "text-blue-400",
  contact_inquiry: "text-green-400",
  property_added: "text-purple-400",
  error: "text-red-400",
};

export default function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onTestNotification,
  onClose,
}) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [position, setPosition] = useState({ right: 0, top: 'auto' });

  // Calculate position to keep panel within viewport
  useEffect(() => {
    const updatePosition = () => {
      if (!panelRef.current) return;

      const panel = panelRef.current;
      const rect = panel.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 16;

      let newRight = 0;

      // Adjust right position if panel overflows right edge
      if (rect.right > viewportWidth - padding) {
        const overflow = rect.right - (viewportWidth - padding);
        newRight = -overflow;
        // If still too wide, ensure minimum padding
        if (rect.left < padding) {
          newRight = viewportWidth - rect.width - padding;
        }
      }

      // Adjust max-height if panel overflows bottom edge
      if (rect.bottom > viewportHeight - padding) {
        const availableHeight = viewportHeight - rect.top - padding;
        if (availableHeight > 200) { // Minimum height
          panel.style.maxHeight = `${availableHeight}px`;
        }
      } else {
        // Reset max-height if there's enough space
        panel.style.maxHeight = 'calc(100vh - 6rem)';
      }

      setPosition({ right: newRight, top: 'auto' });
    };

    // Update position after render
    const timeoutId = setTimeout(updatePosition, 10);
    
    // Update on window resize and scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [notifications.length]);

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.related_id) {
      if (notification.type === "booking") {
        navigate("/bookings");
      } else if (notification.type === "contact_inquiry") {
        // Navigate to a contact inquiries page or bookings
        navigate("/bookings");
      } else if (notification.type === "property_added") {
        navigate("/properties");
      }
    }

    onClose();
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[90vw] sm:w-[380px] max-w-[380px] bg-[#121420] border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
      style={{ 
        maxHeight: 'calc(100vh - 6rem)',
        right: `${position.right}px`,
        top: position.top !== 'auto' ? position.top : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
        <div className="flex items-center gap-2">
          {onTestNotification && (
            <button
              onClick={onTestNotification}
              className="p-1.5 rounded hover:bg-white/10 transition-colors text-yellow-400 hover:text-yellow-300"
              title="Send test notification"
            >
              <Zap size={16} />
            </button>
          )}
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-white/60 hover:text-white transition-colors"
              title="Mark all as read"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={16} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1 min-h-0">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-white/60">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type] || AlertCircle;
              const iconColor = typeColors[notification.type] || "text-white/60";

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${
                    !notification.is_read ? "bg-white/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${iconColor} mt-0.5`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium ${
                            !notification.is_read
                              ? "text-white"
                              : "text-white/70"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-white/40 mt-2">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-white/10 text-center">
          <button
            onClick={() => {
              navigate("/notifications");
              onClose();
            }}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
