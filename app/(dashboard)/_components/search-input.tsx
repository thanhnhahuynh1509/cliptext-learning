import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const SearchInput = () => {
  return (
    <div className="relative w-[460px] h-[45px]">
      <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="w-full h-full outline-none pl-9"
        placeholder="Search your project"
      />
    </div>
  );
};

export default SearchInput;
