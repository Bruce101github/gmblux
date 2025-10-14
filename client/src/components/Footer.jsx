import { PhoneCall } from "lucide-react";

function Footer() {
  return (
    <div className="bg-[#232323]">
      <div className="flex items-center gap-4 justify-center py-10 bg-[#1D1D1D] px-[10%]">
        <div className="h-[70px] w-[70px] rounded-full bg-white/5 p-5">
          <PhoneCall className="h-full w-full object-cover" />
        </div>
        <p>
          Our support team can assist you with reservation{" "}
          <span className="text-lg font-bold">055 394 4428</span>
        </p>
      </div>
      <div className="flex py-10 px-[10%]">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Copyright © 2025. GMBRealEstate. All rights reserved.
          </p>
          <label className="text-lg font-bold">
            Subscribe to our newsletter
          </label>
          <input
            placeholder="Email address"
            className="border-b border-white/15 py-2 outline-none"
          />
        </div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Footer;
