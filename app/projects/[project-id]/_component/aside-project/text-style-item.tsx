import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import Sketch from "@uiw/react-color-sketch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextStyleItem {
  label: string;
  color: string;
}

const TextStyleItem = ({ label, color }: TextStyleItem) => {
  const [colorState, setColorState] = useState(color);

  useEffect(() => {
    setColorState(color);
  }, [color]);

  return (
    <div className="flex gap-x-4 items-center">
      <div className="flex gap-x-2 items-center">
        <CircleHelp className="w-6 h-6" />
        <h4 className="font-bold text-base w-[120px]">{label}</h4>
      </div>

      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            variant={"project"}
            style={{ backgroundColor: colorState }}
            className={`border focus:ring-2 ring-offset-2 transition-all duration-300`}
          ></Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <div className="w-full ">
            <Sketch
              color={colorState}
              className="w-full"
              onChange={(color) => {
                setColorState(color.hex);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TextStyleItem;
