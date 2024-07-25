import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import React from "react";
import TextStyleItem from "./text-style-item";
import { CaptionStyle } from "@/types/caption-style-type";

interface TextStyleSectionProps {
  caption?: CaptionStyle;
}

const TextStyleSection = ({ caption }: TextStyleSectionProps) => {
  return (
    <div className="flex flex-col items-start gap-y-12 w-1/2">
      <TextStyleItem
        label="Past color"
        color={`#${caption?.pastColor ?? "FFFFFF"}`}
      />
      <TextStyleItem
        label="Current color"
        color={`#${caption?.currentColor ?? "FFFFFF"}`}
      />
      <TextStyleItem
        label="Future color"
        color={`#${caption?.futureColor ?? "707070"}`}
      />
      <TextStyleItem
        label="Outline color"
        color={`#${caption?.futureColor ?? "000000"}`}
      />
    </div>
  );
};

export default TextStyleSection;
