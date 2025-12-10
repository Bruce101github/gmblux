import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Phone,
  Home,
  AlertCircle,
  CheckCheck,
  Filter,
  Zap,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { toast } from "react-hot-toast";
import { TOAST_STYLE } from "@/lib/utils";

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

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all");
  const { showNotification, canShowNotifications } = useNotificationPermission();

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel("notifications-page")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, typeFilter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter === "unread") {
        query = query.eq("is_read", false);
      } else if (filter === "read") {
        query = query.eq("is_read", true);
      }

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
      fetchNotifications();
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
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  const sendTestNotification = async () => {
    try {
      toast.loading("Sending test notification...", { style: TOAST_STYLE });

      // Create a test notification in the database
      const testNotification = {
        type: "booking",
        title: "Test Notification",
        message: "This is a test notification to verify that the notification system is working correctly. If you can see this, notifications are functioning properly!",
        related_id: null,
        related_type: "test",
        is_read: false,
      };

      const { data, error } = await supabase
        .from("notifications")
        .insert([testNotification])
        .select()
        .single();

      if (error) throw error;

      toast.dismiss();
      toast.success("Test notification sent!", { style: TOAST_STYLE });

      // Also show native browser notification immediately if permission granted
      if (canShowNotifications) {
        showNotification(testNotification.title, {
          body: testNotification.message,
          tag: `test-notification-${Date.now()}`,
          data: {
            notificationId: data.id,
            type: "test",
          },
        });
      } else {
        toast("Browser notifications are not enabled. Enable them to see native notifications.", {
          style: TOAST_STYLE,
          duration: 4000,
        });
      }

      // Refresh notifications to show the test one
      fetchNotifications();
    } catch (error) {
      toast.dismiss();
      console.error("Error sending test notification:", error);
      toast.error("Failed to send test notification. Check console for details.", {
        style: TOAST_STYLE,
      });
      
      // Fallback: show native notification even if DB insert fails
      if (canShowNotifications) {
        showNotification("Test Notification", {
          body: "This is a test notification. Database insert may have failed, but browser notifications are working!",
          tag: `test-notification-${Date.now()}`,
        });
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          Notifications
        </h2>
        <div className="flex gap-2 lg:gap-6">
          <Button
            onClick={sendTestNotification}
            variant="outline"
            className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
          >
            <Zap size={16} />
            Test Notification
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCheck size={16} />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="hidden lg:block md:block bg-white/10 rounded-xl p-5 w-full mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter size={18} />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <span className="text-white/60 text-sm py-1">Status:</span>
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Unread
              </Button>
              <Button
                variant={filter === "read" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("read")}
              >
                Read
              </Button>
            </div>
            <div className="flex gap-2">
              <span className="text-white/60 text-sm py-1">Type:</span>
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("all")}
              >
                All
              </Button>
              <Button
                variant={typeFilter === "booking" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("booking")}
              >
                Bookings
              </Button>
              <Button
                variant={typeFilter === "contact_inquiry" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("contact_inquiry")}
              >
                Contact Inquiries
              </Button>
              <Button
                variant={typeFilter === "property_added" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("property_added")}
              >
                Properties
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="hidden lg:block md:block bg-white/10 rounded-xl p-5 w-full">
        <div className="flex justify-between text-white items-center mb-5 flex-wrap gap-4">
          <p className="text-base font-medium">
            {notifications.length} {notifications.length === 1 ? "Notification" : "Notifications"}
            {unreadCount > 0 && (
              <span className="ml-2 text-yellow-400">
                ({unreadCount} unread)
              </span>
            )}
          </p>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-white/60">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || AlertCircle;
                const iconColor =
                  typeColors[notification.type] || "text-white/60";

                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/5 transition-colors ${
                      !notification.is_read ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${iconColor} mt-0.5`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
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
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-white/60 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-white/40 mt-2">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
