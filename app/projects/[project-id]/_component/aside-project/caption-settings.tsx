import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useCallback, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import CaptionSettingsHeader from "./caption-settings-header";
import CaptionStyleSelectionSection from "./caption-style-selection-section";
import FontSection from "./font-section";
import TextStyleSection from "./text-style-section";
import { useCaptionStyles } from "@/stores/caption-style-store";
import CaptionPlayer from "./caption-player";
import { useDebounceCallback } from "usehooks-ts";
import { CaptionStyle, createDefaultCaption } from "@/types/caption-style-type";
import { createCaptionStyle, updateCaptionStyle } from "@/api/caption-style";
import { toast } from "sonner";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useTranscript } from "@/stores/transcript-store";
import { Word } from "@/types/transcript-types";
import CreateActionCaptionSection from "./CreateActionCaptionSection";

interface CaptionSettingsProps {
  onStyleOpen: boolean;
  setOnStyleOpen: (onStyleOpen: boolean) => void;
}

const CaptionSettings = ({
  onStyleOpen,
  setOnStyleOpen,
}: CaptionSettingsProps) => {
  const { captionStyles, activeCaptionStyle, updateActiveCaption } =
    useCaptionStyles();
  const { mediaRefCurrent } = useMediaPlayerRef();
  const { words, setWords } = useTranscript();
  const { setCaptionStyles } = useCaptionStyles();
  const [caption, setCaption] = useState<CaptionStyle>();
  const [onCreate, setOnCreate] = useState<boolean>(false);

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

  const afterSetValueCallback = useCallback(
    (caption: CaptionStyle | undefined) => {
      if (!caption) return;
      if (!onCreate) {
        updateActiveCaption(caption);
        debounceUpdateCaptionStyle(caption.id, caption);
      } else {
        setCaption((prev) => ({ ...prev, ...caption }));
      }
    },
    [debounceUpdateCaptionStyle, onCreate, updateActiveCaption]
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
    if (!activeCaptionStyle) return;
    setCaption((prev) => ({ ...prev, ...activeCaptionStyle }));
  }, [activeCaptionStyle]);

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
                  activeCaption={caption}
                  afterSetValueCallback={afterSetValueCallback}
                  onCreate={onCreate}
                  onCreateClick={() => {
                    if (!activeCaptionStyle) {
                      return;
                    }
                    setOnCreate(true);
                    setCaption(
                      createDefaultCaption(
                        activeCaptionStyle?.fontId!,
                        activeCaptionStyle?.authorId!,
                        activeCaptionStyle?.authorName!
                      )
                    );
                  }}
                />

                <Separator className="mt-8 mb-6" />

                <div className="flex items-start w-full gap-x-[100px]">
                  <FontSection
                    caption={caption}
                    afterSetValueCallback={afterSetValueCallback}
                  />

                  <TextStyleSection
                    caption={caption}
                    afterSetValueCallback={afterSetValueCallback}
                  />
                </div>

                {onCreate && (
                  <CreateActionCaptionSection
                    onCancelClick={() => {
                      if (!activeCaptionStyle) {
                        return;
                      }
                      setCaption((prev) => ({
                        ...prev,
                        ...activeCaptionStyle,
                      }));
                      setOnCreate(false);
                    }}
                    onSaveClick={async () => {
                      try {
                        if (!caption) {
                          return;
                        }

                        if (!caption.name.trim()) {
                          toast.error("Caption name is not empty!");
                        }

                        const response = await createCaptionStyle(caption);
                        setCaption(activeCaptionStyle);
                        captionStyles?.push(response);
                        setCaptionStyles(captionStyles);

                        toast.success("New caption was created!");
                      } catch (e) {
                        console.log(e);
                        toast.error(
                          "Couldn't create new caption! Please try again or contact support, thanks."
                        );
                      } finally {
                        setOnCreate(false);
                      }
                    }}
                  />
                )}
              </div>

              <CaptionPlayer caption={caption} />
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CaptionSettings;
