import { Button } from "@/components/ui/button";
import { CircleCheck, X } from "lucide-react";
import React from "react";

interface CreateActionCaptionSectionProps {
  onSaveClick: () => void;
  onCancelClick: () => void;
}

const CreateActionCaptionSection = ({
  onSaveClick,
  onCancelClick,
}: CreateActionCaptionSectionProps) => {
  return (
    <div className="mt-12 mb-6 flex flex-col gap-y-[24px] items-start w-[calc(50%-50px)]">
      <h2 className="font-bold">Everything is good?</h2>
      <div className="flex flex-col gap-y-4 items-start w-full">
        <Button className="w-full justify-start" onClick={onSaveClick}>
          <CircleCheck className="w-4 h-4 mr-2" />
          Yes, save it
        </Button>
        <Button
          variant={"secondary"}
          className="w-full justify-start"
          onClick={onCancelClick}
        >
          <X className="w-4 h-4 mr-2" />
          <span>No, go back!</span>
        </Button>
      </div>
    </div>
  );
};

export default CreateActionCaptionSection;
