import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  File,
  FileType,
  FileVideo,
  Film,
  LoaderCircle,
  Pointer,
} from "lucide-react";
import Edits from "./edits";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { Edit, Word } from "@/types/transcript-types";
import { useTranscript } from "@/stores/transcript-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportEditToDocx, exportEditToMP4 } from "@/exports/exporter";
import { exportMP4 } from "@/api/project";
import { useProjects } from "@/stores/projects-store";
import { toast } from "sonner";
import { SERVER_ENDPOINT } from "@/config/server-config";

interface ContentContainerProps {}

const ContentContainer = ({}: ContentContainerProps) => {
  const mediaEditRef = useRef<HTMLVideoElement>(null);
  const { objectUrl } = useMediaPlayerRef();
  const { edits } = useTranscript();
  const { currentProject } = useProjects();
  const [currentEdit, setCurrentEdit] = useState<Edit | undefined>();
  const [onExportMP4, setOnExportMP4] = useState(false);
  const trackingNoRenderState = useMemo<{
    currentEditMemo?: Edit;
    editsMemo?: Edit[];
    frameCallbackId: number;
    onClickingState: boolean;
    currentWord?: HTMLSpanElement;
  }>(() => {
    return {
      frameCallbackId: 0,
      onClickingState: false,
      currentEditMemo: undefined,
      editsMemo: [],
      currentWord: undefined,
    };
  }, []);

  const onUpdateFrame = useCallback(
    (now: number, metadata: VideoFrameCallbackMetadata) => {
      const currentEdit = trackingNoRenderState.currentEditMemo;
      if (currentEdit && mediaEditRef?.current) {
        const end =
          currentEdit?.words[currentEdit?.words?.length - 1].end / 1000;

        if (trackingNoRenderState.currentWord) {
          trackingNoRenderState.currentWord.classList.remove("bg-blue-600");
          trackingNoRenderState.currentWord.classList.remove("text-white");
          trackingNoRenderState.currentWord.classList.remove(
            "current-edit-word"
          );
        }

        const words = document.querySelectorAll(".edit-word");
        for (let i = 0; i < words.length; i++) {
          const start = parseInt(words[i]?.getAttribute("data-start")!);
          const end = parseInt(words[i]?.getAttribute("data-end")!);

          if (
            metadata.mediaTime &&
            metadata.mediaTime >= start / 1000 &&
            metadata.mediaTime <= end / 1000 &&
            words[i].classList.contains(currentEdit.id)
          ) {
            words[i]?.classList.add("bg-blue-600");
            words[i]?.classList.add("text-white");
            words[i]?.classList.add("current-edit-word");
            trackingNoRenderState.currentWord = words[i] as HTMLSpanElement;
            break;
          }
        }

        if (
          metadata.mediaTime >= end &&
          !trackingNoRenderState.onClickingState
        ) {
          const edits = trackingNoRenderState.editsMemo;
          const currentEditIdx =
            edits?.findIndex((edit) => edit.id == currentEdit.id) || 0;

          if (currentEditIdx + 1 >= (edits?.length || 0)) {
            mediaEditRef.current.pause();
          } else {
            const nextEdit = (edits || [])[currentEditIdx + 1];
            if (nextEdit) {
              setCurrentEdit(nextEdit);
              trackingNoRenderState.currentEditMemo = nextEdit;
              mediaEditRef.current.currentTime = nextEdit.words[0].start / 1000;
            }
          }
        }
      }

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
      trackingNoRenderState.onClickingState = false;
    }
  }, [
    currentEdit,
    objectUrl,
    mediaEditRef,
    trackingNoRenderState,
    onUpdateFrame,
  ]);

  useEffect(() => {
    trackingNoRenderState.editsMemo = edits;
  }, [edits, trackingNoRenderState]);

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
              <SearchInput placeholder="title, content..." />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size={"icon"}>
                    <ArrowDownToLine className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="w-[150px]"
                >
                  <DropdownMenuLabel>Export your Edits</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      exportEditToDocx(edits ?? []);
                    }}
                  >
                    <FileType className="w-4 h-4 text-muted-foreground mr-2" />
                    Word
                    <DropdownMenuShortcut>.docx</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    disabled={onExportMP4}
                    onClick={async () => {
                      setOnExportMP4(true);
                      toast.info("Exporting your edits...");
                      try {
                        await exportEditToMP4(
                          currentProject?.id!,
                          currentProject?.url!,
                          currentProject?.name!
                        );
                        toast.success("Exported your edits mp4 successfully!");
                      } catch (e) {
                        toast.error(
                          "Couldn't export your edits mp4! Please try again or contact support."
                        );
                      } finally {
                        setOnExportMP4(false);
                      }
                    }}
                  >
                    {!onExportMP4 && (
                      <Film className="w-4 h-4 text-muted-foreground mr-2" />
                    )}
                    {onExportMP4 && (
                      <LoaderCircle className="w-4 h-4 text-muted-foreground mr-2 animate-spin" />
                    )}
                    Video
                    <DropdownMenuShortcut>.mp4</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="edits" className="w-full flex-1 overflow-hidden">
            <ScrollArea className="flex-1 w-full h-full">
              <Edits
                currentEdit={currentEdit}
                setCurrentEdit={(edit?: Edit) => {
                  trackingNoRenderState.onClickingState = true;
                  trackingNoRenderState.currentEditMemo = edit;
                  setCurrentEdit(edit);
                }}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default memo(ContentContainer);
