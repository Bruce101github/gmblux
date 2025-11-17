import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Save, User, Mail, Phone, Lock } from "lucide-react";
import { TOAST_STYLE } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: user?.email || "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (user?.id) {
        const { data } = await supabase
          .from("admins")
          .select("first_name, last_name, user_img")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setProfile((prev) => ({
            ...prev,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
          }));
        }
      }
    }
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User not found", { style: TOAST_STYLE });
      return;
    }

    setLoading(true);
    try {
      // Update admin profile
      const { error } = await supabase
        .from("admins")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!", { style: TOAST_STYLE });
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`, { style: TOAST_STYLE });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields", { style: TOAST_STYLE });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match", { style: TOAST_STYLE });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters", { style: TOAST_STYLE });
      return;
    }

    setLoading(true);
    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully!", { style: TOAST_STYLE });
      e.target.reset();
    } catch (error) {
      toast.error(`Failed to update password: ${error.message}`, { style: TOAST_STYLE });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          Settings
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-yellow-400" size={20} />
              <h3 className="text-white text-lg font-bold">Profile Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">First Name</label>
                <Input
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  className="bg-[#121420] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Last Name</label>
                <Input
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                  className="bg-[#121420] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block flex items-center gap-2">
                  <Mail size={14} />
                  Email
                </label>
                <Input
                  value={profile.email}
                  disabled
                  className="bg-[#121420]/50 border-white/10 text-white/60"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full"
              >
                <Save size={16} />
                Save Changes
              </Button>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="text-yellow-400" size={20} />
              <h3 className="text-white text-lg font-bold">Security</h3>
            </div>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Current Password</label>
                <Input
                  name="currentPassword"
                  type="password"
                  required
                  className="bg-[#121420] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">New Password</label>
                <Input
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  className="bg-[#121420] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Confirm Password</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  className="bg-[#121420] border-white/10 text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#121420] hover:bg-[#1a1b2e] text-white font-bold w-full"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

