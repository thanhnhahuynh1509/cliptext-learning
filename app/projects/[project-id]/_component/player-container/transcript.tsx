import { cn, formatDuration } from "@/lib/utils";
import React from "react";
import { Jost } from "next/font/google";

const jostFont = Jost({
  subsets: ["latin"],
  weight: "400",
});

interface TranscriptProps {
  utterances: any[];
}

const Transcript = ({ utterances }: TranscriptProps) => {
  return (
    <div className="mt-4 mx-3 flex flex-col gap-y-[44px] bg-white pt-4 pb-8 px-4 rounded-md flex-1 h-full">
      {utterances.map((utterance, idx) => {
        return (
          <div key={idx} className="flex items-start gap-x-4">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-2">
                <p className="font-medium text-sm w-[150px] select-none">
                  Speaker {utterance.speaker}
                </p>

                <p
                  className={cn(
                    "text-sm text-muted-foreground w-[48px] select-none",
                    jostFont.className
                  )}
                >
                  {formatDuration(utterance.start / 1000)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <p
                className={cn(
                  "flex-1 text-start text-lg leading-7 tracking-wide",
                  jostFont.className
                )}
              >
                {utterance.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Transcript;
