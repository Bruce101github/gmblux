import { X } from "lucide-react";
import { useState } from "react";

function ContactInfoModal({ isOpen, onClose, onContinue, actionType }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && phone && email) {
      onContinue({ name, phone, email });
      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#121420] rounded-lg w-[90%] max-w-md p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {actionType === "call" ? "Contact Information" : "Contact Information"}
          </h2>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-white/60 text-sm mb-6">
          Please provide your contact information to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-white text-sm mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-white/20 p-2 outline-none text-white/70 bg-white/5 rounded-t focus:border-white/40 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-white text-sm mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-b border-white/20 p-2 outline-none text-white/70 bg-white/5 rounded-t focus:border-white/40 transition-colors"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-white text-sm mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-white/20 p-2 outline-none text-white/70 bg-white/5 rounded-t focus:border-white/40 transition-colors"
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 border border-white/40 rounded-3xl text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-yellow-400 rounded-3xl font-medium text-black hover:bg-yellow-500 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactInfoModal;
