import { cn, formatDuration, getSelectedSpanIds } from "@/lib/utils";
import { Word } from "@/types/transcript-types";
import { Jost } from "next/font/google";
import React, { useCallback, useMemo, useState } from "react";
import WordItem from "./word-item";
import { useTranscript } from "@/stores/transcript-store";
import { useSelection } from "@/stores/selection-store";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";

const jostFont = Jost({
  subsets: ["latin"],
  weight: "400",
});

interface UtteranceWordsItemProps {
  handledUtterance: any;
}

const UtteranceWordsItem = ({ handledUtterance }: UtteranceWordsItemProps) => {
  const { words: transcriptWords } = useTranscript();
  const { mediaRefCurrent } = useMediaPlayerRef();
  const { setSelectionRect, setSelectionMenuVisible, setSelectionWords } =
    useSelection();

  const trackingNoRenderState = useMemo(() => {
    return {
      selectedText: "",
    };
  }, []);

  const onClickWord = useCallback(
    (word: Word) => {
      if (mediaRefCurrent) {
        mediaRefCurrent.currentTime = word.start / 1000;
      }
    },
    [mediaRefCurrent]
  );

  const onMouseUp = useCallback(() => {
    const activeSelection = document.getSelection();
    if (activeSelection?.anchorNode?.parentElement?.tagName != "SPAN") {
      return;
    }
    if (
      activeSelection?.isCollapsed ||
      activeSelection?.toString() === trackingNoRenderState.selectedText
    ) {
      setSelectionMenuVisible(false);
      setSelectionWords([]);
      setSelectionRect(undefined);
      activeSelection.removeAllRanges();
      trackingNoRenderState.selectedText = "";
      return;
    }
    trackingNoRenderState.selectedText = activeSelection?.toString()!;
    const ids = getSelectedSpanIds();
    const selectionWords = transcriptWords?.filter((word) =>
      ids.includes(word.id)
    );
    setSelectionWords(selectionWords);
    setSelectionMenuVisible(true);
    setSelectionRect(
      activeSelection?.focusNode?.parentElement?.getBoundingClientRect()
    );
  }, [
    setSelectionMenuVisible,
    setSelectionRect,
    setSelectionWords,
    trackingNoRenderState,
    transcriptWords,
  ]);

  const renderedUtterances = useMemo(() => {
    return handledUtterance?.words?.map((words: Word[], idx: number) => {
      const startMs = words[0]?.start;
      return (
        <div
          key={idx}
          className="pl-[150px] flex gap-x-4 w-full"
          onMouseUp={onMouseUp}
        >
          <p
            className={cn(
              "text-sm text-muted-foreground w-[48px] select-none leading-7 pointer-events-none",
              jostFont.className
            )}
          >
            {formatDuration(startMs / 1000)}
          </p>

          <div className="flex-1 text-wrap pr-8">
            {words?.map((word: Word) => {
              return (
                <WordItem
                  key={word.id}
                  word={word}
                  onClick={onClickWord}
                  className="word"
                />
              );
            })}
          </div>
        </div>
      );
    });
  }, [handledUtterance?.words, onClickWord, onMouseUp]);

  return <>{renderedUtterances}</>;
};

export default UtteranceWordsItem;
