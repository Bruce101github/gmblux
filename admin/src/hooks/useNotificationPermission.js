import { useState, useEffect } from "react";

export function useNotificationPermission() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [isSupported, setIsSupported] = useState(
    typeof Notification !== "undefined"
  );

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn("Browser notifications are not supported");
      return false;
    }

    if (permission === "granted") {
      return true;
    }

    if (permission === "denied") {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const showNotification = (title, options = {}) => {
    if (!isSupported || permission !== "granted") {
      return null;
    }

    // Browser notifications require absolute URLs for icons
    // Use the site's logo from public folder or a data URL
    const getIconUrl = () => {
      if (options.icon) return options.icon;
      // Try to use logo from public folder
      return window.location.origin + "/gmblogo.JPG";
    };

    const defaultOptions = {
      icon: getIconUrl(),
      badge: options.badge || getIconUrl(),
      tag: options.tag || "gmb-lux-notification",
      requireInteraction: false,
      silent: false,
      ...options,
    };

    try {
      const notification = new Notification(title, defaultOptions);

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click to focus window
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error("Error showing notification:", error);
      return null;
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    canShowNotifications: isSupported && permission === "granted",
  };
}
