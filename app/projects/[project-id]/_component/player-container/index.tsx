import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Transcript from "./transcript";
import Player from "./player";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { FileDown, MoveUp } from "lucide-react";
import Chapters from "./chapters";
import { memo, useEffect, useState } from "react";
import TranscriptMenu from "./transcript-menu";
import Hint from "@/components/hint";
import {
  exportChaptersToDocx,
  exportTranscriptToDocx,
} from "@/exports/exporter";
import { useTranscript } from "@/stores/transcript-store";
import { useDebounceValue } from "usehooks-ts";
import { useGlobalSearch } from "@/stores/global-search-store";

interface PlayerContainerRef {
  setCurrentTime: (time: number) => void;
  currentTime?: number;
}

const PlayerContainer = ({
  setCurrentTime,
  currentTime,
}: PlayerContainerRef) => {
  const [onExpand, setOnExpand] = useState(false);
  const [currentTab, setCurrentTab] = useState("transcript");
  const [debounceValue, setDebounceValue] = useDebounceValue("", 200);

  const { chapters, utterances, speakerMap } = useTranscript();
  const { setSearchType, setSearchValue } = useGlobalSearch();

  const onExportClick = () => {
    if (currentTab === "transcript") {
      exportTranscriptToDocx(utterances ?? [], speakerMap ?? {});
    } else {
      exportChaptersToDocx(chapters ?? []);
    }
  };

  useEffect(() => {
    setSearchType(currentTab);
    setSearchValue(debounceValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, setSearchType, setSearchValue]);

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

            <SearchInput
              placeholder="transcript, speaker..."
              onChange={(e) => setDebounceValue(e.target.value)}
            />
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

        <TabsContent value="transcript" className="w-full h-full flex-1">
          <Transcript />
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
