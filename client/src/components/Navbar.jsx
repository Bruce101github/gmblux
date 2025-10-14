import { Search } from "lucide-react";
import Logo from "../assets/gmblogo.JPG";

function Navbar() {
  return (
    <div className="flex w-auto justify-between px-[10%] pt-[20px] pb-[5%]">
      <div className="flex gap-4">
        <div className="h-[50px] w-[50px] rounded-full bg-gray-300">
          <img src={Logo} className="rounded-full" />
        </div>
        <div className="relative min-w-[400px] bg-white rounded-4xl flex items-center px-1">
          <select className="text-black ml-4">
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
          <div className="h-[60%] w-[1.5px] bg-gray-300 mx-2"></div>
          <input className="text-black min-w-[356px]" />
          <div className="h-[42px] w-[42px] bg-yellow-400 rounded-full flex justify-center items-center">
            {" "}
            <Search />
          </div>
        </div>
      </div>
      <div className="flex gap-x-4">
        <a>Consultation</a>
        <a>Listings</a>
      </div>
    </div>
  );
}

export default Navbar;
