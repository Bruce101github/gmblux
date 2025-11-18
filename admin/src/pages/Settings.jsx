import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Save, User, Mail, Phone, Lock, Bell, Camera, X, Upload } from "lucide-react";
import { TOAST_STYLE } from "@/lib/utils";
import { motion } from "framer-motion";
import { resizeImage, isImageFile } from "@/lib/imageUtils";

export default function Settings() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: user?.email || "",
    phone: "",
    notification_email: "",
    user_img: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (user?.id) {
        const { data } = await supabase
          .from("admins")
          .select("first_name, last_name, user_img, phone, notification_email")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setProfile((prev) => ({
            ...prev,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
            notification_email: data.notification_email || "",
            user_img: data.user_img || "",
          }));
          if (data.user_img) {
            setProfileImagePreview(data.user_img);
          }
        }
      }
    }
    fetchProfile();
  }, [user]);

  const handleImageUpload = async (file) => {
    if (!isImageFile(file)) {
      toast.error("Please select an image file", { style: TOAST_STYLE });
      return;
    }

    setUploadingImage(true);
    try {
      // Resize image
      const resizedFile = await resizeImage(file, 500, 500, 0.9);
      
      // Upload to storage
      const fileName = `profile-${user.id}-${Date.now()}.${resizedFile.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("property_images")
        .upload(fileName, resizedFile, {
          contentType: resizedFile.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("property_images")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from("admins")
        .update({ user_img: imageUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setProfileImagePreview(imageUrl);
      setProfile((prev) => ({ ...prev, user_img: imageUrl }));
      setProfileImage(null);
      toast.success("Profile picture updated!", { style: TOAST_STYLE });
    } catch (error) {
      toast.error(`Failed to upload image: ${error.message}`, { style: TOAST_STYLE });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = async () => {
    setUploadingImage(true);
    try {
      const { error } = await supabase
        .from("admins")
        .update({ user_img: null })
        .eq("user_id", user.id);

      if (error) throw error;

      setProfileImagePreview(null);
      setProfileImage(null);
      setProfile((prev) => ({ ...prev, user_img: "" }));
      toast.success("Profile picture removed!", { style: TOAST_STYLE });
    } catch (error) {
      toast.error(`Failed to remove image: ${error.message}`, { style: TOAST_STYLE });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User not found", { style: TOAST_STYLE });
      return;
    }

    // Upload image if new one selected
    if (profileImage) {
      await handleImageUpload(profileImage);
    }

    setLoading(true);
    try {
      // Update admin profile
      const updateData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone || null,
        notification_email: profile.notification_email || null,
      };

      // Add image URL if it was just uploaded
      if (profileImagePreview && !profile.user_img) {
        updateData.user_img = profileImagePreview;
      }

      const { error } = await supabase
        .from("admins")
        .update(updateData)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!", { style: TOAST_STYLE });
      setProfileImage(null); // Clear selected image after save
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
      <div className="grid lg:grid-cols-3 gap-4">
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
              {/* Profile Picture */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                        <User size={32} className="text-white/40" />
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="bg-[#121420] hover:bg-[#1a1b2e] text-white text-sm"
                      size="sm"
                    >
                      <Camera size={14} className="mr-1" />
                      {profileImagePreview ? "Change" : "Upload"}
                    </Button>
                    {profileImagePreview && (
                      <Button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm"
                        size="sm"
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">First Name</label>
                <Input
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  className="bg-[#121420] border-white/10 text-white"
                  placeholder="Enter first name"
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
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block flex items-center gap-2">
                  <Phone size={14} />
                  Phone Number
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="bg-[#121420] border-white/10 text-white"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block flex items-center gap-2">
                  <Mail size={14} />
                  Email (Login)
                </label>
                <Input
                  value={profile.email}
                  disabled
                  className="bg-[#121420]/50 border-white/10 text-white/60"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={loading || uploadingImage}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full"
              >
                <Save size={16} className="mr-2" />
                {loading ? "Saving..." : "Save Changes"}
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
              <Bell className="text-yellow-400" size={20} />
              <h3 className="text-white text-lg font-bold">Notification Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block flex items-center gap-2">
                  <Mail size={14} />
                  Notification Email
                </label>
                <Input
                  type="email"
                  value={profile.notification_email}
                  onChange={(e) =>
                    setProfile({ ...profile, notification_email: e.target.value })
                  }
                  className="bg-[#121420] border-white/10 text-white"
                  placeholder="email@example.com"
                />
                <p className="text-white/40 text-xs mt-1">
                  Email address where you'll receive notifications for new bookings, inquiries, etc.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm mb-3">Notification Preferences</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/80 text-sm">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-white/20 bg-[#121420] text-yellow-400"
                    />
                    New booking requests
                  </label>
                  <label className="flex items-center gap-2 text-white/80 text-sm">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-white/20 bg-[#121420] text-yellow-400"
                    />
                    Property inquiries
                  </label>
                  <label className="flex items-center gap-2 text-white/80 text-sm">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-white/20 bg-[#121420] text-yellow-400"
                    />
                    Customer messages
                  </label>
                  <label className="flex items-center gap-2 text-white/80 text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-[#121420] text-yellow-400"
                    />
                    Weekly reports
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
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

