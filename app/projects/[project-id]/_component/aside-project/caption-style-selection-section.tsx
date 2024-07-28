import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaptionStyle } from "@/types/caption-style-type";
import { EllipsisIcon, EllipsisVertical, Pen, Trash2 } from "lucide-react";
import React, { memo, useEffect, useMemo } from "react";

interface CaptionStyleSelectionSectionProps {
  captions: CaptionStyle[];
  activeCaption?: CaptionStyle;
}

const CaptionStyleSelectionSection = ({
  captions,
  activeCaption,
}: CaptionStyleSelectionSectionProps) => {
  return (
    <div className="flex gap-x-8 items-end w-full">
      <div className="flex gap-x-2 items-end flex-1">
        <div className="flex flex-col gap-y-4 flex-1">
          <h4 className="font-bold text-base">Select caption style</h4>
          <Select
            onValueChange={(value) => {
              console.log(value);
            }}
            defaultValue={activeCaption?.name?.toLocaleLowerCase() ?? "default"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Caption name" />
            </SelectTrigger>
            <SelectContent>
              {captions?.map((caption) => {
                return (
                  <SelectItem
                    key={caption.id}
                    value={caption.name.toLowerCase()}
                  >
                    {caption.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Button size={"icon"} variant={"ghost"}>
          <EllipsisVertical className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex gap-x-4 items-center">
        <Button>Add new style</Button>

        {!activeCaption?.isDefault && (
          <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(CaptionStyleSelectionSection);
