import { useTranscript } from "@/stores/transcript-store";
import { Chapter } from "@/types/transcript-types";
import ChapterItem from "./chapter-item";
import { Fragment, memo } from "react";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { Separator } from "@/components/ui/separator";

const Chapters = () => {
  const { chapters } = useTranscript();
  const { mediaRefCurrent } = useMediaPlayerRef();

  return (
    <div className="flex flex-col gap-y-4 mt-7">
      {chapters?.map((chapter: Chapter) => {
        return (
          <Fragment key={chapter.id}>
            <ChapterItem
              chapter={chapter}
              onClick={(chapter: Chapter) => {
                if (mediaRefCurrent) {
                  mediaRefCurrent.currentTime = chapter.start / 1000;
                }
              }}
            />

            <Separator className="h-[0px]" />
          </Fragment>
        );
      })}
    </div>
  );
};

export default memo(Chapters);
