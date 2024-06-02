import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Transcript from "./transcript";
import Player from "./player";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  FileDown,
  MoveUp,
  Pen,
} from "lucide-react";
import Chapters from "./chapters";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import TranscriptMenu from "./transcript-menu";
import Hint from "@/components/hint";
import { useSpeakerModifier } from "@/stores/speaker-modifier-store";
import {
  exportChaptersToDocx,
  exportTranscriptToDocx,
} from "@/exports/exporter";
import { useTranscript } from "@/stores/transcript-store";

interface PlayerContainerRef {
  setCurrentTime: (time: number) => void;
  currentTime?: number;
}

const PlayerContainer = ({
  setCurrentTime,
  currentTime,
}: PlayerContainerRef) => {
  const [onExpand, setOnExpand] = useState(false);
  const [onScroll, setOnScroll] = useState(false);
  const [currentTab, setCurrentTab] = useState("transcript");
  const [isCurrentWordVisible, setIsCurrentWordVisible] = useState(true);
  const [outTopDirection, setOutTopDirection] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { chapters, utterances, speakerMap } = useTranscript();

  const { setCurrentSpeaker, setCurrentSpeakerElement } = useSpeakerModifier();
  const currentWordRefMemo = useMemo(() => {
    return {
      offsetTop: null,
      top: null,
      bottom: null,
      onClickingBack: false,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentWordEl = document.querySelector(
      ".current-word"
    ) as HTMLSpanElement;
    if (currentWordEl) {
      const scrollEl = containerRef?.current;
      const rect = currentWordEl.getBoundingClientRect();
      currentWordRefMemo.top = rect.top as any;
      currentWordRefMemo.bottom = rect.bottom as any;
      currentWordRefMemo.offsetTop = currentWordEl?.offsetTop as any;

      const scrollRect = scrollEl?.getBoundingClientRect();
      const isInContainer =
        rect.top + 10 >= scrollRect?.top! &&
        rect.bottom <= scrollRect?.bottom! + 5;

      setIsCurrentWordVisible(isInContainer);

      if (rect.top < scrollRect?.top!) {
        setOutTopDirection(true);
      } else if (rect.bottom > scrollRect?.bottom!) {
        setOutTopDirection(false);
      }

      if (!isInContainer && !onScroll) {
        currentWordRefMemo.onClickingBack = true;
        scrollEl?.scrollTo({
          top: currentWordEl?.offsetTop - 26,
          behavior: "smooth",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.querySelector(".current-word")]);

  useEffect(() => {
    const scrollEl = containerRef?.current;
    if (scrollEl) {
      scrollEl.onscrollend = (e) => {
        if (isCurrentWordVisible) {
          setOnScroll(false);
        }
        currentWordRefMemo.onClickingBack = false;
      };
    }
  }, [currentWordRefMemo, isCurrentWordVisible]);

  const onBackClick = () => {
    const scrollEl = containerRef?.current;
    if (currentWordRefMemo.offsetTop) {
      scrollEl?.scrollTo({
        top: currentWordRefMemo.offsetTop - 26,
        behavior: "smooth",
      });
      currentWordRefMemo.onClickingBack = true;
    }
  };

  const onExportClick = () => {
    if (currentTab === "transcript") {
      exportTranscriptToDocx(utterances ?? [], speakerMap ?? {});
    } else {
      exportChaptersToDocx(chapters ?? []);
    }
  };

  const handleOnScroll = useCallback(() => {
    setCurrentSpeakerElement(undefined);
    setCurrentSpeaker(undefined);
    if (!currentWordRefMemo.onClickingBack) {
      setOnScroll(true);
    }
  }, [
    currentWordRefMemo.onClickingBack,
    setCurrentSpeaker,
    setCurrentSpeakerElement,
  ]);

  return (
    <div className="flex-1 bg-white flex flex-col gap-y-4 h-full pl-6 py-6 ">
      <Player
        onExpand={onExpand}
        setCurrentTime={setCurrentTime}
        currentTime={currentTime}
      />

      <Tabs
        defaultValue={"transcript"}
        className="w-full flex-1 flex flex-col items-start overflow-y-auto"
      >
        <div className="flex items-center justify-between py-4 w-full">
          <TabsList>
            <TabsTrigger
              value="transcript"
              onClick={() => {
                setCurrentTab("transcript");
              }}
            >
              Transcript
            </TabsTrigger>
            <TabsTrigger
              value="chapters"
              onClick={() => {
                setCurrentTab("chapters");
              }}
            >
              Summary
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-x-4">
            <Hint label={`${onExpand ? "Shrink" : "Expand"}`}>
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  setOnExpand((prev) => !prev);
                }}
              >
                <MoveUp
                  className={`w-4 h-4 ${!onExpand ? "rotate-180" : "rotate-0"} transition-all ease-in-out duration-500`}
                />
              </Button>
            </Hint>

            <SearchInput placeholder="transcript, speaker..." />
            <Hint label="Export to Word">
              <Button
                size={"icon"}
                className="bg-blue-500 hover:bg-blue-600"
                onClick={onExportClick}
              >
                <FileDown className="w-4 h-4" />
              </Button>
            </Hint>
          </div>
        </div>

        <ScrollArea
          className="w-full relative"
          ref={containerRef}
          onScroll={handleOnScroll}
        >
          <TabsContent value="transcript">
            <Transcript />
          </TabsContent>

          {onScroll && !isCurrentWordVisible && (
            <>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                <Button
                  className="rounded-full w-12 h-12 bg-white animate-bounce"
                  variant={"outline"}
                  size={"icon"}
                  onClick={onBackClick}
                >
                  {outTopDirection && <ArrowUp className="w-5 h-5" />}
                  {!outTopDirection && <ArrowDown className="w-5 h-5" />}
                </Button>
              </div>
            </>
          )}
        </ScrollArea>

        <ScrollArea>
          <TabsContent value="chapters" className="w-full flex-1">
            <Chapters />
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <TranscriptMenu />
    </div>
  );
};

export default memo(PlayerContainer);
