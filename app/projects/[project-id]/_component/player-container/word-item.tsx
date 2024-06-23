import { cn } from "@/lib/utils";
import { Word } from "@/types/transcript-types";
import { Jost } from "next/font/google";
import React, { memo, useRef } from "react";

const jostFont = Jost({
  subsets: ["latin"],
  weight: "400",
});

interface WordItemProps {
  word: Word;
  onClick?: (word: Word) => void;
  onBlur?: (
    event: React.FocusEvent<HTMLSpanElement, Element>,
    word: Word
  ) => void;
  isEditable?: boolean;
  className?: string;
  searchValue?: string;
}

const WordItem = ({
  word,
  className,
  isEditable,
  searchValue,
  onClick,
  onBlur,
}: WordItemProps) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const searchSplit = searchValue
    ?.split(" ")
    ?.map((text) => text.toLowerCase());
  let renderedText = word.text;

  for (const text of searchSplit ?? []) {
    if (word.text.toLowerCase().includes(text)) {
      const lowerText = word.text.toLowerCase();
      const startIndex = lowerText.indexOf(text);
      const sliceText = word.text.slice(startIndex, startIndex + text.length);
      renderedText = word.text.replace(
        sliceText,
        `<span class="bg-yellow-200">${sliceText}</span>`
      );
    }
  }

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
        contentEditable={isEditable}
        spellCheck={false}
        suppressContentEditableWarning
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) {
            onClick(word);
          }
        }}
        onBlur={(e) => {
          if (onBlur) {
            onBlur(e, word);
          }
        }}
        ref={spanRef}
        dangerouslySetInnerHTML={{
          __html: searchValue?.trim() ? renderedText : word.text,
        }}
      ></span>

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
