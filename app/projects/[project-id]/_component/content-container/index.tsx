import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchInput from "@/components/search-input";
import { Pointer } from "lucide-react";
import Edits from "./edits";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { Edit } from "@/types/transcript-types";
import { useTranscript } from "@/stores/transcript-store";

import ExportButton from "./export-button";
import { useDebounceValue } from "usehooks-ts";
import { useGlobalSearch } from "@/stores/global-search-store";

interface ContentContainerProps {}

const ContentContainer = ({}: ContentContainerProps) => {
  const mediaEditRef = useRef<HTMLVideoElement>(null);
  const { objectUrl } = useMediaPlayerRef();
  const { edits } = useTranscript();
  const [currentTime, setCurrentTime] = useState(0);
  const [currentEdit, setCurrentEdit] = useState<Edit | undefined>();
  const [debounceValue, setDebounceValue] = useDebounceValue("", 200);
  const { setSearchType, setSearchValue } = useGlobalSearch();

  const trackingNoRenderState = useMemo<{
    frameCallbackId: number;
    currentWord?: HTMLSpanElement;
  }>(() => {
    return {
      frameCallbackId: 0,
      currentWord: undefined,
    };
  }, []);

  const onUpdateFrame = useCallback(
    (now: number, metadata: VideoFrameCallbackMetadata) => {
      setCurrentTime(metadata.mediaTime);
      trackingNoRenderState.frameCallbackId =
        mediaEditRef?.current?.requestVideoFrameCallback(onUpdateFrame) || 0;
    },
    [trackingNoRenderState]
  );

  useEffect(() => {
    if (objectUrl && mediaEditRef?.current && currentEdit) {
      if (objectUrl && !mediaEditRef?.current?.src) {
        mediaEditRef.current.src = objectUrl;
        mediaEditRef.current.load();

        trackingNoRenderState.frameCallbackId =
          mediaEditRef.current.requestVideoFrameCallback(onUpdateFrame);
      }
      const start = currentEdit?.words[0].start / 1000;
      mediaEditRef.current.currentTime = start;
    }
  }, [
    currentEdit,
    objectUrl,
    mediaEditRef,
    trackingNoRenderState,
    onUpdateFrame,
  ]);

  useEffect(() => {
    console.log(currentEdit);
    if (currentEdit && mediaEditRef?.current) {
      const end = currentEdit?.words[currentEdit?.words?.length - 1].end / 1000;

      if (trackingNoRenderState.currentWord) {
        trackingNoRenderState.currentWord.classList.remove("bg-blue-600");
        trackingNoRenderState.currentWord.classList.remove("text-white");
        trackingNoRenderState.currentWord.classList.remove("current-edit-word");
      }

      const words = document.querySelectorAll(".edit-word");
      for (let i = 0; i < words.length; i++) {
        const start = parseInt(words[i]?.getAttribute("data-start")!);
        const end = parseInt(words[i]?.getAttribute("data-end")!);

        if (
          currentTime &&
          currentTime >= start / 1000 &&
          currentTime <= end / 1000 &&
          words[i].classList.contains(currentEdit.id)
        ) {
          words[i]?.classList.add("bg-blue-600");
          words[i]?.classList.add("text-white");
          words[i]?.classList.add("current-edit-word");
          trackingNoRenderState.currentWord = words[i] as HTMLSpanElement;
          break;
        }
      }

      if (currentTime >= end) {
        const currentEditIdx =
          edits?.findIndex((edit) => edit.id == currentEdit.id) || 0;

        const nextEdit = (edits || [])[(currentEditIdx + 1) % edits?.length!];
        if (nextEdit) {
          setCurrentEdit(nextEdit);
          mediaEditRef.current.currentTime = nextEdit.words[0].start / 1000;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  useEffect(() => {
    setSearchType("edits");
    setSearchValue(debounceValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, setSearchType, setSearchValue]);

  useEffect(() => {
    return () => {
      if (mediaEditRef?.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mediaEditRef.current?.cancelVideoFrameCallback(
          trackingNoRenderState.frameCallbackId
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-y-4 w-[40%] h-full pl-3 py-6 bg-white">
      <div className="flex flex-col gap-y-4 overflow-y-auto w-full h-full">
        <div className="w-full aspect-[16/9] px-3 edit-video-container">
          <video
            id="edit-player"
            controls
            className={`w-full aspect-[16/9] rounded-sm ${!currentEdit && "hidden"}`}
            ref={mediaEditRef}
          />

          {!currentEdit && (
            <div className="w-full aspect-[16/9] bg-gray-800 rounded-sm relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <Pointer className="mt-6 w-8 h-8 text-white" />

                <p className="font-normal text-sm text-white mt-6">
                  Try to select an edit!
                </p>
              </div>
            </div>
          )}
        </div>

        <Tabs
          defaultValue="edits"
          className="w-full h-full px-3 flex flex-col items-start overflow-y-auto"
        >
          <div className="flex items-center justify-between py-2 w-full">
            <TabsList>
              <TabsTrigger value="edits">Edits</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-x-4 mr-2">
              <SearchInput
                placeholder="title, content..."
                onChange={(e) => setDebounceValue(e.target.value)}
              />
              <ExportButton />
            </div>
          </div>

          <TabsContent
            value="edits"
            className="w-full h-full overflow-hidden flex-1"
          >
            <Edits
              currentEdit={currentEdit}
              setCurrentEdit={(edit?: Edit) => {
                setCurrentEdit(edit);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default memo(ContentContainer);
