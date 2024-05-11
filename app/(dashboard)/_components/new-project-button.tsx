import { useCreateProjectModal } from "@/stores/create-project-modal-store";
import { PlusCircle } from "lucide-react";
import React from "react";

const NewProjectButton = () => {
  const { setOpen } = useCreateProjectModal();
  const onClick = () => {
    setOpen(true);
  };

  return (
    <div
      onClick={onClick}
      className="group aspect-[100/127] rounded-lg border flex flex-col overflow-hidden cursor-pointer relative bg-white"
    >
      <div className="absolute top-0 left-0 right-0 bottom-0  flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-100 transition">
        <div className="flex flex-col gap-y-4 justify-center items-center w-full h-full">
          <PlusCircle className="w-8 h-8 fill-white " />
        </div>
      </div>
    </div>
  );
};

export default NewProjectButton;
