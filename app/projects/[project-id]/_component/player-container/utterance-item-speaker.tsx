import { updateSpeaker } from "@/api/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProjects } from "@/stores/projects-store";
import { useSpeakerModifier } from "@/stores/speaker-modifier-store";
import { useTranscript } from "@/stores/transcript-store";
import { Utterance } from "@/types/transcript-types";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UtteranceItemSpeakerProps {
  utterance: Utterance;
}

const UtteranceItemSpeaker = ({ utterance }: UtteranceItemSpeakerProps) => {
  const { speakerMap } = useTranscript();
  const { setCurrentSpeaker, setCurrentSpeakerElement } = useSpeakerModifier();
  const ref = useRef<HTMLParagraphElement>(null);

  return (
    <div
      className={`flex items-center gap-x-2 ${!(utterance as any).shameSpeaker ? "sticky" : ""} top-0`}
      onClick={(e) => {
        e.stopPropagation();
        setCurrentSpeaker(utterance.speaker);
        setCurrentSpeakerElement(ref?.current || undefined);
      }}
    >
      <p
        ref={ref}
        className="font-medium text-sm text-yellow-700 select-none cursor-pointer border border-dashed border-transparent hover:border-gray-200 transition p-2"
      >
        {!(utterance as any).shameSpeaker &&
          speakerMap &&
          speakerMap[utterance.speaker]}
      </p>
    </div>
  );
};

export default UtteranceItemSpeaker;
