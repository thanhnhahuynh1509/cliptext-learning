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
import { ArrowUpFromLine, LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { DebouncedState } from "usehooks-ts";
import {
  handleChangeFontSize,
  handleChangeMaxCharactersOnScreen,
  handleKeyDownFontSize,
  handleKeyDownMaxCharactersOnScreen,
  handleOnFontValueChange,
} from "./font-section-handler";
import { useUser } from "@clerk/nextjs";
import { saveFont } from "@/api/font";
import { toast } from "sonner";
import { addFontToDom } from "@/lib/utils";

interface FontSectionProps {
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void;
  caption?: CaptionStyle;
}

const FontSection = ({ afterSetValueCallback, caption }: FontSectionProps) => {
  const { fonts, setFonts, getActiveFontByCaption } = useFontServer();
  const { user } = useUser();
  const [onLoad, setOnLoad] = useState(false);
  const activeFont = getActiveFontByCaption(fonts, caption);

  return (
    <div className="flex flex-col gap-y-8 items-start w-1/2">
      <div className="flex gap-x-4 items-end justify-between w-full">
        <div className="flex flex-col gap-y-4 w-full">
          <h4 className="font-bold text-base">Font family</h4>
          <Select
            value={`${activeFont?.id}`}
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

        <Button
          size={"icon"}
          className="w-[50px]"
          disabled={onLoad}
          onClick={(e) => {
            const uploadInput = document.createElement("input");
            uploadInput.type = "file";
            uploadInput.accept = ".ttf";

            const fontChange = async (e: any) => {
              if (onLoad) {
                return;
              }

              setOnLoad(true);
              try {
                const files = e.target.files;
                if (!files?.length) {
                  return;
                }
                const formData = new FormData();
                formData.append("file", files[0]);
                formData.append("authorId", user?.id!);
                formData.append("authorName", user?.fullName!);
                const font = await saveFont(formData);
                if (caption) {
                  caption.fontId = font.id;
                }
                const updatedFonts = [...(fonts ?? []), font];
                setFonts(updatedFonts);
                addFontToDom(updatedFonts ?? []);
                uploadInput.removeEventListener("change", fontChange);
                afterSetValueCallback(caption);

                toast.success(
                  "Upload font successfully! Set to active font also"
                );
              } catch (e) {
                console.log(e);
                toast.error(
                  "Couldn't upload font! Please try again or contact support"
                );
              } finally {
                setOnLoad(false);
              }
            };
            uploadInput.addEventListener("change", fontChange);
            uploadInput.click();
            uploadInput.remove();
          }}
        >
          {!onLoad && <ArrowUpFromLine className="w-4 h-4" />}
          {onLoad && <LoaderCircle className="w-4 h-4 animate-spin" />}
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
