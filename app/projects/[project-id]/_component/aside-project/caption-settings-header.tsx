import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";

interface CaptionSettingsHeaderProps {
  onClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const CaptionSettingsHeader = ({ onClose }: CaptionSettingsHeaderProps) => {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <Button size={"icon"} variant={"project"} onClick={onClose}>
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <h2 className="text-2xl font-bold">Caption styles</h2>
      </div>
    </div>
  );
};

export default CaptionSettingsHeader;
