import React, { RefObject, memo } from "react";

import UtterancesList from "./utterances-list";
import SpeakerPopup from "./speaker-popup";
import { VirtuosoHandle } from "react-virtuoso";
import { Utterance } from "@/types/transcript-types";

interface TranscriptProps {
  virtuoso: RefObject<VirtuosoHandle>;
  setScrollUtterances: (utterances: Utterance[]) => void;
}

const Transcript = ({ virtuoso, setScrollUtterances }: TranscriptProps) => {
  return (
    <div className="h-full w-full mt-4 mx-3 flex flex-col gap-y-4 bg-white pt-4 pb-8 px-4 rounded-md flex-1">
      <UtterancesList
        virtuoso={virtuoso}
        setScrollUtterances={setScrollUtterances}
      />

      <SpeakerPopup />
    </div>
  );
};

export default memo(Transcript);
