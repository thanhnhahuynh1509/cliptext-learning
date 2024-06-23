import React, { memo, useEffect, useState } from "react";
import UtteranceItem from "./utterance-item";
import { useTranscript } from "@/stores/transcript-store";
import { Utterance, Word } from "@/types/transcript-types";
import { Virtuoso } from "react-virtuoso";
import { useSpeakerModifier } from "@/stores/speaker-modifier-store";
import { useGlobalSearch } from "@/stores/global-search-store";

const UtterancesList = () => {
  const { utterances, speakerMap } = useTranscript();
  const [handledUtterances, setHandleUtterances] = useState<any>();
  const [searchHandledUtterances, setSearchHandledUtterances] = useState<
    Utterance[]
  >([]);
  const [onLoading, setOnLoading] = useState(true);
  const { searchValue, searchType } = useGlobalSearch();

  const {
    setCurrentSpeaker,
    setCurrentSpeakerElement,
    currentSpeaker,
    currentSpeakerElement,
  } = useSpeakerModifier();

  useEffect(() => {
    try {
      setOnLoading(true);
      if (utterances) {
        const results = [];
        for (const utterance of utterances) {
          let words: Word[] = [];
          for (const word of utterance.words) {
            words.push(word);
            if (/[.!?]/.test(word.text)) {
              results.push({ ...utterance, words: words });
              words = [];
            }
          }
          if (words?.length) {
            results.push({ ...utterance, words: words });
            words = [];
          }
        }
        setHandleUtterances(results);
        setSearchHandledUtterances(results);
      }
    } finally {
      setOnLoading(false);
    }
  }, [utterances]);

  useEffect(() => {
    if (searchType == "transcript") {
      const search = searchValue?.toLocaleLowerCase() || "";
      setSearchHandledUtterances((prev) =>
        handledUtterances?.filter((utterance: Utterance) => {
          const text = utterance.words
            .reduce((acc, word) => {
              return acc + " " + word.text;
            }, "")
            ?.toLowerCase();
          const speakerName = (speakerMap ?? {})[
            utterance.speaker
          ]?.toLowerCase();
          return text?.includes(search) || speakerName?.includes(search);
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    if (searchHandledUtterances) {
      searchHandledUtterances.forEach((utterance, idx) => {
        if (idx > 0) {
          (utterance as any).shameSpeaker =
            utterance.speaker === searchHandledUtterances[idx - 1].speaker;
        }
      });
    }
  }, [searchHandledUtterances]);

  return (
    <div className="relative w-full h-full">
      {!onLoading && (
        <>
          {(searchHandledUtterances?.length || 0) <= 0 && (
            <div className="flex flex-col items-center">
              <h2 className="text-muted-foreground">
                Does not have any transcript!
              </h2>
            </div>
          )}
          <Virtuoso
            className="w-full h-full gap-y-4"
            data={searchHandledUtterances}
            onScroll={(e) => {
              if (currentSpeaker || currentSpeakerElement) {
                setCurrentSpeaker(undefined);
                setCurrentSpeakerElement(undefined);
              }
            }}
            itemContent={(index, utterance) => {
              return (
                <UtteranceItem key={utterance?.id} utterance={utterance} />
              );
            }}
          />
        </>
      )}
    </div>
  );
};

export default memo(UtterancesList);
