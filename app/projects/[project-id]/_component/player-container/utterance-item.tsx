import React, { memo } from "react";
import UtteranceWordsItem from "./utterance-words-items";
import UtteranceItemSpeaker from "./utterance-item-speaker";

interface UtteranceItemProps {
  utterance: any;
}

const UtteranceItem = ({ utterance }: UtteranceItemProps) => {
  return (
    <div className="w-full flex items-start flex-col gap-x-4">
      <UtteranceItemSpeaker utterance={utterance} />

      <div className="flex flex-col gap-y-4">
        <UtteranceWordsItem utterance={utterance} />
      </div>
    </div>
  );
};

export default memo(UtteranceItem);
