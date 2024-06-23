import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Transcript from "./transcript";
import Player from "./player";
import Chapters from "./chapter";
import { memo, useEffect, useRef, useState } from "react";
import TranscriptMenu from "./transcript-menu";

import TranscriptActionBar from "./transcript-action-bar";
import { useGlobalToggleState } from "@/stores/global-toggle-state-store";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { VirtuosoHandle } from "react-virtuoso";
import { Utterance } from "@/types/transcript-types";

interface PlayerContainerRef {
  setCurrentTime: (time: number) => void;
  currentTime?: number;
}

const PlayerContainer = ({
  setCurrentTime,
  currentTime,
}: PlayerContainerRef) => {
  const { onExpand } = useGlobalToggleState();
  const [currentTab, setCurrentTab] = useState("transcript");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollButtonDirection, setScrollButtonDirection] =
    useState<string>("up");
  const [scrollUtterances, setScrollUtterances] = useState<Utterance[]>([]);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const utterancesDom = document.querySelectorAll(".utterance-item");
    console.log(scrollContainerRef.current?.getBoundingClientRect());
    if (utterancesDom.length) {
      const firstElement = utterancesDom[0];
      const lastElement = utterancesDom[utterancesDom?.length - 1];
      const startStr = firstElement.getAttribute("data-start") || "0";
      const endStr = lastElement.getAttribute("data-end") || "0";
      const start = parseInt(startStr) / 1000;
      const end = parseInt(endStr) / 1000;

      if (currentTime && currentTime >= start && currentTime <= end) {
        // fit
        setShowScrollButton(false);
      } else if (currentTime && currentTime < start) {
        // less than
        setShowScrollButton(true);
        setScrollButtonDirection("up");
      } else if (currentTime && currentTime > end) {
        // greater than
        setScrollButtonDirection("down");
        setShowScrollButton(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  return (
    <div className="flex-1 bg-white flex flex-col gap-y-4 h-full pl-6 py-6 ">
      <Player
        onExpand={onExpand}
        setCurrentTime={setCurrentTime}
        currentTime={currentTime}
      />

      <Tabs
        defaultValue={"transcript"}
        className="w-full flex-1 flex flex-col items-start "
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

          <TranscriptActionBar currentTab={currentTab} />
        </div>

        <TabsContent value="transcript" className="w-full h-full flex-1">
          <div className="w-full h-full relative" ref={scrollContainerRef}>
            <Transcript
              virtuoso={virtuoso}
              setScrollUtterances={setScrollUtterances}
            />

            {showScrollButton && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="rounded-full w-10 h-10 bottom-12 left-1/2 absolute bg-white shadow-md animate-bounce"
                onClick={(e) => {
                  for (let i = 0; i < scrollUtterances.length; i++) {
                    const words = scrollUtterances[i].words;
                    const start = words[0].start / 1000;
                    const end = words[words.length - 1].end / 1000;
                    if (
                      currentTime &&
                      currentTime >= start &&
                      currentTime <= end
                    ) {
                      virtuoso.current?.scrollToIndex({
                        index: i,
                        behavior: "smooth",
                      });
                      break;
                    }
                  }
                }}
              >
                {scrollButtonDirection === "up" && (
                  <ArrowUp className="w-4 h-4" />
                )}
                {scrollButtonDirection === "down" && (
                  <ArrowDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chapters" className="w-full h-full flex-1">
          <Chapters />
        </TabsContent>
      </Tabs>

      <TranscriptMenu />
    </div>
  );
};

export default memo(PlayerContainer);
