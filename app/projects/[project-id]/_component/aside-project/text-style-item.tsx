import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import Sketch from "@uiw/react-color-sketch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounceCallback } from "usehooks-ts";

interface TextStyleItem {
  label: string;
  color: string;
  onChange: (hex: string) => void;
}

const TextStyleItem = ({ label, color, onChange }: TextStyleItem) => {
  const [colorState, setColorState] = useState(color);
  const [onOpen, setOnOpen] = useState(false);
  const debounceChange = useDebounceCallback(onChange, 500);

  useEffect(() => {
    setColorState(color);
  }, [color]);

  return (
    <div className="flex gap-x-4 items-center justify-between w-full">
      <div className="flex gap-x-2 items-center">
        <CircleHelp className="w-6 h-6" />
        <h4 className="font-bold text-base w-[120px]">{label}</h4>
      </div>

      <Popover
        modal={true}
        open={onOpen}
        onOpenChange={(e) => {
          console.log("hehe", e);
          setOnOpen(e);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            variant={"project"}
            style={{ backgroundColor: colorState }}
            className={`border ${onOpen ? "ring-2 ring-offset-2" : ""} transition-all duration-300`}
          ></Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" sideOffset={10}>
          <div className="w-full">
            <Sketch
              disableAlpha
              color={colorState}
              className="w-full"
              onChange={(color) => {
                setColorState(color.hex);
                debounceChange(color.hex);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TextStyleItem;
