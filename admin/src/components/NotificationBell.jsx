import { useState, useEffect, useRef } from "react";
import { Bell, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import NotificationsPanel from "./NotificationsPanel";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import NotificationPermissionPrompt from "./NotificationPermissionPrompt";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const panelRef = useRef(null);
  const {
    permission,
    canShowNotifications,
    requestPermission,
    showNotification,
  } = useNotificationPermission();

  // Check permission on mount
  useEffect(() => {
    if (permission === "default") {
      // Show permission prompt after a short delay
      const timer = setTimeout(() => {
        setShowPermissionPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [permission]);

  // Helper function to show native browser notification
  const showNativeNotification = (notification) => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        const notif = new Notification(notification.title, {
          body: notification.message,
          icon: window.location.origin + "/gmblogo.JPG",
          badge: window.location.origin + "/gmblogo.JPG",
          tag: `notification-${notification.id}`,
          requireInteraction: false,
          silent: false,
          data: {
            notificationId: notification.id,
            type: notification.type,
            relatedId: notification.related_id,
          },
        });

        setTimeout(() => {
          notif.close();
        }, 5000);

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        
        return true;
      } catch (error) {
        console.error("Error showing native notification:", error);
        return false;
      }
    }
    return false;
  };

  // Helper function to add notification to state
  const addNotificationToState = (newNotification) => {
    setNotifications((prev) => {
      // Check if notification already exists to prevent duplicates
      const exists = prev.some((n) => n.id === newNotification.id);
      if (exists) return prev;
      return [newNotification, ...prev];
    });
    setUnreadCount((prev) => prev + 1);
    showNativeNotification(newNotification);
  };

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel("notifications-bell", {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          console.log("New notification received via real-time:", payload.new);
          addNotificationToState(payload.new);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          console.log("Notification updated:", payload.new);
          // Update notification if it was marked as read
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.id === payload.new.id ? payload.new : notif
            )
          );
          // Recalculate unread count
          fetchUnreadCount();
        }
      )
      .subscribe((status) => {
        console.log("Notification subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to notifications");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Error subscribing to notifications channel");
        } else {
          console.warn("⚠️ Subscription status:", status);
        }
      });

    // Fallback: Poll for new notifications every 3 seconds if real-time fails
    // This ensures notifications appear even if real-time isn't working
    let lastNotificationId = null;
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id, created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          // Check if we have a new notification
          if (!lastNotificationId) {
            // First run - just set the ID
            lastNotificationId = data.id;
          } else if (data.id !== lastNotificationId) {
            console.log("New notification detected via polling, fetching all notifications...");
            // Fetch all notifications to get the new one
            const { data: allNotifications, error: fetchError } = await supabase
              .from("notifications")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(20);

            if (!fetchError && allNotifications) {
              // Find the new notification
              const newNotifications = allNotifications.filter(n => n.id !== lastNotificationId);
              if (newNotifications.length > 0) {
                console.log(`Found ${newNotifications.length} new notification(s) via polling`);
                newNotifications.forEach(notif => {
                  addNotificationToState(notif);
                });
              }
            }
            lastNotificationId = data.id;
          }
        }
      } catch (err) {
        // Silently fail polling
      }
    }, 3000);

    return () => {
      console.log("Cleaning up notification subscription");
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, []); // Empty deps - only run once on mount

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      console.log("Fetched notifications:", data?.length || 0);
      setNotifications(data || []);
      fetchUnreadCount();
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
      
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (error) throw error;
      
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // Check if click is not on the bell button
        if (!event.target.closest('[data-notification-bell]')) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionPrompt(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      console.log("Sending test notification...");
      
      // Create a test notification in the database
      const testNotification = {
        type: "booking",
        title: "Test Notification",
        message: "This is a test notification to verify that the notification system is working correctly. If you can see this, notifications are functioning properly!",
        related_id: null,
        related_type: "test",
        is_read: false,
      };

      // Insert into database first
      const { data, error } = await supabase
        .from("notifications")
        .insert([testNotification])
        .select()
        .single();

      if (error) {
        console.error("Error inserting test notification:", error);
        throw error;
      }

      console.log("Test notification inserted:", data);

      // Immediately add to state and show native notification
      // Don't wait for real-time subscription
      // addNotificationToState already calls showNativeNotification
      addNotificationToState(data);
      
    } catch (error) {
      console.error("Error sending test notification:", error);
      // Fallback: show native notification even if DB insert fails
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          const notification = new Notification("Test Notification", {
            body: "This is a test notification. Database insert may have failed, but browser notifications are working!",
            icon: window.location.origin + "/gmblogo.JPG",
            tag: `test-notification-${Date.now()}`,
          });
          setTimeout(() => notification.close(), 5000);
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (err) {
          console.error("Error showing fallback notification:", err);
        }
      }
    }
  };

  return (
    <>
      <div className="relative" ref={panelRef}>
        <button
          data-notification-bell
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-md hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          {!canShowNotifications && permission === "denied" && (
            <AlertCircle
              size={12}
              className="absolute -bottom-0 -right-0 text-yellow-400"
              title="Notifications blocked"
            />
          )}
        </button>
        {isOpen && (
          <NotificationsPanel
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onTestNotification={sendTestNotification}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
      {showPermissionPrompt && !canShowNotifications && (
        <NotificationPermissionPrompt
          onAllow={handleRequestPermission}
          onDismiss={() => setShowPermissionPrompt(false)}
        />
      )}
    </>
  );
}
