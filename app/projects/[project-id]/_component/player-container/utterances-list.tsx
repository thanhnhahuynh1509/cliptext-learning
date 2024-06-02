import React, { memo, useEffect, useState } from "react";
import UtteranceItem from "./utterance-item";
import { useTranscript } from "@/stores/transcript-store";
import { Word } from "@/types/transcript-types";

const UtterancesList = () => {
  const { utterances } = useTranscript();
  const [handledUtterances, setHandleUtterances] = useState<any>();
  const [onLoading, setOnLoading] = useState(true);

  useEffect(() => {
    try {
      setOnLoading(true);
      if (utterances) {
        const results = [];
        for (const utterance of utterances) {
          let groupWords: Word[][] = [];
          const handledUtterance = { ...utterance, words: groupWords };
          let words = [];
          for (const word of utterance?.words) {
            words.push(word);
            if (/[.!?]/.test(word.text)) {
              handledUtterance.words.push(words);
              words = [];
            }
          }
          if (words.length) {
            handledUtterance.words.push(words);
            words = [];
          }
          results.push(handledUtterance);
        }
        setHandleUtterances(results);
      }
    } finally {
      setOnLoading(false);
    }
  }, [utterances]);

  return (
    <>
      {!onLoading && (
        <>
          {handledUtterances?.map((utterance: any) => {
            return (
              <UtteranceItem key={utterance?.id} handledUtterance={utterance} />
            );
          })}
        </>
      )}
    </>
  );
};

export default memo(UtterancesList);
