import { Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationPermissionPrompt({
  onAllow,
  onDismiss,
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <div className="bg-[#121420] border border-white/20 rounded-lg shadow-xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bell size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm mb-1">
                Enable Browser Notifications
              </h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Get instant alerts when new bookings or contact inquiries arrive.
                Stay updated even when you're not on the dashboard.
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} className="text-white/60" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onAllow}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Check size={16} />
            Enable Notifications
          </Button>
          <Button
            onClick={onDismiss}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            Not Now
          </Button>
        </div>
      </div>
    </div>
  );
}
