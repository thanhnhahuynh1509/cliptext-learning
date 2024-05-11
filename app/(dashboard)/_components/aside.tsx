import { ButtonIcon } from "@/components/button-icon";
import { CircleHelp, Folder, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Aside = () => {
  return (
    <aside className="w-14 h-full overflow-hidden flex flex-col border-r fixed py-5 px-2 gap-y-4 bg-white z-[49]">
      <Link className="flex w-full aspect-square relative" href={"/"}>
        <Image src={"/logo.svg"} alt="logo" className="top-0 left-0 p-1" fill />
      </Link>

      <div className="flex flex-col gap-y-2 items-center justify-center">
        <ButtonIcon
          label="Folders"
          side="right"
          align="start"
          sideOffset={6}
          icon={Folder}
        />

        <ButtonIcon
          label="Users"
          side="right"
          align="start"
          sideOffset={6}
          icon={Users}
        />
      </div>

      <div className="mt-auto flex flex-col items-center justify-center gap-y-2">
        <ButtonIcon
          label="Setting"
          side="right"
          align="start"
          sideOffset={6}
          icon={Settings}
        />
        <ButtonIcon
          label="Helps"
          side="right"
          align="start"
          sideOffset={6}
          icon={CircleHelp}
        />
      </div>
    </aside>
  );
};

export default Aside;
