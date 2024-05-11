import { EllipsisVertical } from "lucide-react";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import DropdownMenuProject from "./dropdown-menu-project";
import Hint from "@/components/hint";

interface FooterProps {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
}

const Footer = ({ name, createdBy, createdAt, id }: FooterProps) => {
  return (
    <div className="py-4 pl-4 pr-2 h-[100px]">
      <div className="flex items-start justify-between w-full gap-x-8">
        <h2
          className="text-foreground font-medium text-base flex-1 line-clamp-2 cursor-pointer"
          title={name}
        >
          {name}
        </h2>

        <DropdownMenuProject projectName={name} projectId={id}>
          <button
            className="outline-none opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
          </button>
        </DropdownMenuProject>
      </div>

      <p className="text-muted-foreground font-normal text-[12px] mt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
        {createdBy}, {formatDistanceToNow(createdAt, { addSuffix: true })}
      </p>
    </div>
  );
};

export default Footer;
