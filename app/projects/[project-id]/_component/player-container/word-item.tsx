import { cn } from "@/lib/utils";
import { Word } from "@/types/transcript-types";
import { Jost } from "next/font/google";
import React, { memo } from "react";

const jostFont = Jost({
  subsets: ["latin"],
  weight: "400",
});

interface WordItemProps {
  word: Word;
  onClick?: (word: Word) => void;
  isEditable?: boolean;
  className?: string;
}

const WordItem = ({ word, className, isEditable, onClick }: WordItemProps) => {
  return (
    <>
      <span
        data-id={word.id}
        data-start={word.start}
        data-end={word.end}
        className={cn(
          "flex-1 text-start text-lg tracking-wide outline-none",
          jostFont.className,
          className
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) {
            onClick(word);
          }
        }}
      >
        {word.text}
      </span>

      <span
        key={word.text + word.id}
        className={cn(
          `flex-1 text-start text-lg leading-7 tracking-wide`,
          jostFont.className,
          className
        )}
        onClick={() => {
          if (onClick) {
            onClick(word);
          }
        }}
      >
        {" "}
      </span>
    </>
  );
};

export default memo(WordItem);
