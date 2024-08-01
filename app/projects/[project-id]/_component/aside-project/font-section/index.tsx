import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCaptionStyles } from "@/stores/caption-style-store";
import { useFontServer } from "@/stores/font-server-store";
import { CaptionStyle } from "@/types/caption-style-type";
import { ArrowUpFromLine } from "lucide-react";
import React from "react";
import { DebouncedState } from "usehooks-ts";
import {
  handleChangeFontSize,
  handleChangeMaxCharactersOnScreen,
  handleKeyDownFontSize,
  handleKeyDownMaxCharactersOnScreen,
  handleOnFontValueChange,
} from "./font-section-handler";

interface FontSectionProps {
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void;
  caption?: CaptionStyle;
}

const FontSection = ({ afterSetValueCallback, caption }: FontSectionProps) => {
  const { fonts, getActiveFontByCaption } = useFontServer();
  const activeFont = getActiveFontByCaption(fonts, caption);

  return (
    <div className="flex flex-col gap-y-8 items-start w-1/2">
      <div className="flex gap-x-4 items-end justify-between w-full">
        <div className="flex flex-col gap-y-4 w-full">
          <h4 className="font-bold text-base">Font family</h4>
          <Select
            defaultValue={`${activeFont?.id}`}
            onValueChange={(value: string) => {
              handleOnFontValueChange(caption, value, afterSetValueCallback);
            }}
          >
            <SelectTrigger
              className="w-full"
              style={{ fontFamily: activeFont?.fontFamily }}
            >
              <SelectValue
                placeholder="Choose your font"
                className="w-full flex-1"
              />
            </SelectTrigger>

            <SelectContent>
              {fonts?.map((font) => {
                return (
                  <SelectItem
                    key={font.id}
                    value={`${font.id}`}
                    style={{ fontFamily: font.fontFamily }}
                  >
                    {font.fontTitle}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Button size={"icon"} className="w-[50px]">
          <ArrowUpFromLine className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-y-4 w-full">
        <h4 className="font-bold text-base">Font size</h4>
        <Input
          type="number"
          placeholder="Enter your font size"
          min={10}
          defaultValue={caption?.fontSize ?? 70}
          onKeyDown={(event) => {
            handleKeyDownFontSize(event, caption, afterSetValueCallback);
          }}
          onBlur={(event) => {
            handleChangeFontSize(event, caption, afterSetValueCallback);
          }}
        />
      </div>

      <div className="flex flex-col gap-y-4 w-full">
        <h4 className="font-bold text-base">Max characters on screen</h4>
        <Input
          type="number"
          placeholder="Enter number of characters"
          min={10}
          defaultValue={caption?.maxCharactersOnScreen ?? 20}
          onKeyDown={(event) => {
            handleKeyDownMaxCharactersOnScreen(
              event,
              caption,
              afterSetValueCallback
            );
          }}
          onBlur={(event) => {
            handleChangeMaxCharactersOnScreen(
              event,
              caption,
              afterSetValueCallback
            );
          }}
        />
      </div>
    </div>
  );
};

export default FontSection;
