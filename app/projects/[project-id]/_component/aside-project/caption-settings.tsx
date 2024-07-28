import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useCallback, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import CaptionSettingsHeader from "./caption-settings-header";
import CaptionStyleSelectionSection from "./caption-style-selection-section";
import FontSection from "./font-section";
import TextStyleSection from "./text-style-section";
import { useCaptionStyles } from "@/stores/caption-style-store";
import CaptionPlayer from "./caption-player";
import { useDebounceCallback } from "usehooks-ts";
import { CaptionStyle } from "@/types/caption-style-type";
import { updateCaptionStyle } from "@/api/caption-style";
import { toast } from "sonner";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useTranscript } from "@/stores/transcript-store";
import { Word } from "@/types/transcript-types";

interface CaptionSettingsProps {
  onStyleOpen: boolean;
  setOnStyleOpen: (onStyleOpen: boolean) => void;
}

const CaptionSettings = ({
  onStyleOpen,
  setOnStyleOpen,
}: CaptionSettingsProps) => {
  const { captionStyles, activeCaptionStyle } = useCaptionStyles();
  const { mediaRefCurrent } = useMediaPlayerRef();
  const { words, setWords } = useTranscript();

  const debounceUpdateCaptionStyle = useDebounceCallback(
    async (id: number, caption: CaptionStyle) => {
      try {
        await updateCaptionStyle(id, caption);
      } catch (e) {
        console.log(e);
        toast.error("Something went wrong when saving caption!");
      }
    },
    1000
  );

  const updateMainMediaCaption = useCallback(
    (
      mediaRefCurrent: HTMLVideoElement | undefined,
      words: Word[] | undefined
    ) => {
      setWords([...(words ?? [])]);
      if (!mediaRefCurrent) return;
      mediaRefCurrent.currentTime += 1 / 24;
      mediaRefCurrent.currentTime -= 1 / 24;
    },
    [setWords]
  );

  useEffect(() => {
    if (!mediaRefCurrent) return;
    mediaRefCurrent.pause();
  }, [mediaRefCurrent, onStyleOpen]);

  useEffect(() => {
    return () => {
      updateMainMediaCaption(mediaRefCurrent, words);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sheet
      modal
      open={onStyleOpen}
      onOpenChange={(e) => {
        setOnStyleOpen(e);
        if (!e) {
          updateMainMediaCaption(mediaRefCurrent, words);
        }
      }}
    >
      <SheetContent className="w-screen sm:w-screen h-screen" side={"left"}>
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <div className="w-full h-full flex flex-col gap-y-[68px]">
            <CaptionSettingsHeader
              onClose={() => {
                setOnStyleOpen(false);
                updateMainMediaCaption(mediaRefCurrent, words);
              }}
            />

            <div className="flex gap-x-[64px] justify-between">
              <div className="flex-1 w-full">
                <CaptionStyleSelectionSection
                  captions={captionStyles ?? []}
                  activeCaption={activeCaptionStyle}
                />

                <Separator className="mt-8 mb-6" />

                <div className="flex items-start w-full gap-x-[100px]">
                  <FontSection
                    onUpdateCaption={debounceUpdateCaptionStyle}
                    caption={activeCaptionStyle}
                  />

                  <TextStyleSection
                    caption={activeCaptionStyle}
                    onUpdateCaption={debounceUpdateCaptionStyle}
                  />
                </div>
              </div>

              <CaptionPlayer caption={activeCaptionStyle} />
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CaptionSettings;
