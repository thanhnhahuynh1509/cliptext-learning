import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVER_ENDPOINT } from "@/config/server-config";
import { useCaptionStyles } from "@/stores/caption-style-store";
import { useFontServer } from "@/stores/font-server-store";
import { CaptionStyle } from "@/types/caption-style-type";
import { ArrowUpFromLine } from "lucide-react";
import React from "react";
import { DebouncedState } from "usehooks-ts";

interface FontSectionProps {
  onUpdateCaption: DebouncedState<
    (id: number, caption: CaptionStyle) => Promise<void>
  >;
}

const FontSection = ({ onUpdateCaption }: FontSectionProps) => {
  const { fonts, getActiveFontByCaption } = useFontServer();
  const { activeCaptionStyle, updateActiveCaption } = useCaptionStyles();
  const activeFont = getActiveFontByCaption(fonts, activeCaptionStyle);

  const handleChangeFonSize = (event: any, caption?: CaptionStyle) => {
    if (!caption) return;
    if (!event.currentTarget.value) {
      event.currentTarget.value = `${caption.fontSize}`;
      return;
    }
    const value = Math.max(parseInt(event.currentTarget.value), 10);
    if (caption.fontSize == value) return;

    caption.fontSize = value;
    event.currentTarget.value = value;
    updateActiveCaption(caption);
    onUpdateCaption(caption.id, caption);
  };

  const handleChangeMaxCharactersOnScreen = (
    event: any,
    caption?: CaptionStyle
  ) => {
    if (!caption) return;
    if (!event.currentTarget.value) {
      event.currentTarget.value = `${caption.maxCharactersOnScreen}`;
      return;
    }
    const value = Math.max(parseInt(event.currentTarget.value), 10);
    if (caption.maxCharactersOnScreen == value) return;

    caption.maxCharactersOnScreen = value;
    event.currentTarget.value = value;
    updateActiveCaption(caption);
    onUpdateCaption(caption.id, caption);
  };

  return (
    <div className="flex flex-col gap-y-8 items-start w-1/2">
      <div className="flex gap-x-4 items-end justify-between w-full">
        <div className="flex flex-col gap-y-4 w-full">
          <h4 className="font-bold text-base">Font family</h4>
          <Select
            defaultValue={`${activeFont?.id}`}
            onValueChange={(value) => {
              if (!activeCaptionStyle) return;
              const intValue = parseInt(value);
              if (activeCaptionStyle.fontId == intValue) return;

              activeCaptionStyle.fontId = intValue;
              updateActiveCaption(activeCaptionStyle);
              onUpdateCaption(activeCaptionStyle.id, activeCaptionStyle);
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
          defaultValue={activeCaptionStyle?.fontSize ?? 70}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              handleChangeFonSize(e, activeCaptionStyle);
              return;
            }
          }}
          onBlur={(event) => {
            handleChangeFonSize(event, activeCaptionStyle);
          }}
        />
      </div>

      <div className="flex flex-col gap-y-4 w-full">
        <h4 className="font-bold text-base">Max characters on screen</h4>
        <Input
          type="number"
          placeholder="Enter number of characters"
          min={10}
          defaultValue={activeCaptionStyle?.maxCharactersOnScreen ?? 20}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              handleChangeMaxCharactersOnScreen(e, activeCaptionStyle);
              return;
            }
          }}
          onBlur={(event) => {
            handleChangeMaxCharactersOnScreen(event, activeCaptionStyle);
          }}
        />
      </div>
    </div>
  );
};

export default FontSection;
