import React from "react";
import TextStyleItem from "./text-style-item";
import {
  CaptionStyle,
  DEFAULT_CURRENT_COLOR,
  DEFAULT_FUTURE_COLOR,
  DEFAULT_OUTLINE_COLOR,
  DEFAULT_PAST_COLOR,
} from "@/types/caption-style-type";

interface TextStyleSectionProps {
  caption?: CaptionStyle;
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void;
}

const TextStyleSection = ({
  caption,
  afterSetValueCallback,
}: TextStyleSectionProps) => {
  return (
    <div className="flex flex-col items-start gap-y-12 w-1/2">
      <TextStyleItem
        label="Past color"
        color={`#${caption?.pastColor ?? DEFAULT_PAST_COLOR}`}
        onChange={(hex: string) => {
          if (!caption) return;
          const updatedCaption = {
            ...caption,
            pastColor: hex.replace("#", ""),
          };
          afterSetValueCallback(updatedCaption);
        }}
      />
      <TextStyleItem
        label="Current color"
        color={`#${caption?.currentColor ?? DEFAULT_CURRENT_COLOR}`}
        onChange={(hex: string) => {
          if (!caption) return;
          const updatedCaption = {
            ...caption,
            currentColor: hex.replace("#", ""),
          };
          afterSetValueCallback(updatedCaption);
        }}
      />
      <TextStyleItem
        label="Future color"
        color={`#${caption?.futureColor ?? DEFAULT_FUTURE_COLOR}`}
        onChange={(hex: string) => {
          if (!caption) return;
          const updatedCaption = {
            ...caption,
            futureColor: hex.replace("#", ""),
          };
          afterSetValueCallback(updatedCaption);
        }}
      />
      <TextStyleItem
        label="Outline color"
        color={`#${caption?.outlineColor ?? DEFAULT_OUTLINE_COLOR}`}
        onChange={(hex: string) => {
          if (!caption) return;
          const updatedCaption = {
            ...caption,
            outlineColor: hex.replace("#", ""),
          };
          afterSetValueCallback(updatedCaption);
        }}
      />
    </div>
  );
};

export default TextStyleSection;
