import React, { memo } from "react";
import UtteranceWordsItem from "./utterance-words-items";
import UtteranceItemSpeaker from "./utterance-item-speaker";

interface UtteranceItemProps {
  utterance: any;
  index: number;
}

const UtteranceItem = ({ utterance, index }: UtteranceItemProps) => {
  return (
    <div
      className="utterance-item w-full flex items-start flex-col gap-x-4"
      data-index={index}
      data-start={utterance?.words[0]?.start}
      data-end={utterance?.words[utterance?.words?.length - 1]?.end}
    >
      <UtteranceItemSpeaker utterance={utterance} />

      <div className="flex flex-col gap-y-4">
        <UtteranceWordsItem utterance={utterance} />
      </div>
    </div>
  );
};

export default memo(UtteranceItem);
