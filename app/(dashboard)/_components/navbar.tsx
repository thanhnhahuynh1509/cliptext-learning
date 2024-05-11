import React from "react";
import SearchInput from "./search-input";
import { ButtonIcon } from "@/components/button-icon";
import { Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="w-full h-[80px] px-5 pt-1 flex items-center justify-between">
      <SearchInput />
      <div className="flex gap-4 items-center">
        <ButtonIcon icon={Bell} label="Notification" />
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
