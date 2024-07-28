import {
  CaptionStyle,
  DEFAULT_CURRENT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_FUTURE_COLOR,
  DEFAULT_MAX_CHARACTERS_ON_SCREEN,
  DEFAULT_OUTLINE_COLOR,
  DEFAULT_PAST_COLOR,
} from "@/types/caption-style-type";
import { Word } from "@/types/transcript-types";
import { toBGR } from "./utils";

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const cs = Math.floor((seconds % 1) * 100);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
}

export function generateASS(
  words: Word[],
  font: string,
  caption?: CaptionStyle
) {
  words = JSON.parse(JSON.stringify(words));
  const textPastColor = toBGR(caption?.pastColor ?? DEFAULT_PAST_COLOR);
  const textFutureColor = toBGR(caption?.futureColor ?? DEFAULT_FUTURE_COLOR);
  const textCurrentColor = toBGR(
    caption?.currentColor ?? DEFAULT_CURRENT_COLOR
  );
  const outlineColor = toBGR(caption?.outlineColor ?? DEFAULT_OUTLINE_COLOR);
  const fontSize = caption?.fontSize ?? DEFAULT_FONT_SIZE;
  const maxCharactersOnScreen =
    caption?.maxCharactersOnScreen ?? DEFAULT_MAX_CHARACTERS_ON_SCREEN;
  const groupWords = [];
  let tempWords: Word[] = [];
  let text = "";
  let lastWord: any = null;

  for (const word of words) {
    if (text?.length >= maxCharactersOnScreen) {
      groupWords.push(tempWords);
      tempWords = [];
      text = "";
    }
    const lastEnd = lastWord?.end ?? word.start;
    const gap = word.start / 1000 - lastEnd / 1000;
    if (gap >= 0.25) {
      groupWords.push(tempWords);
      tempWords = [];
      text = "";
    } else {
      if (lastWord) {
        lastWord.end = word.start;
      }
    }

    text = text + " " + word.text;
    tempWords.push(word);
    lastWord = word;
  }

  if (tempWords?.length) {
    groupWords.push(tempWords);
  }

  const eventsStr: string[] = [];
  for (const group of groupWords) {
    for (let i = 0; i < group.length; i++) {
      const word = group[i];
      const text = group
        .map((item, index) => {
          if (index === i) {
            return `{\\1c&H${textCurrentColor}&}${item.text}{\\1c&H${textFutureColor}&}`;
          }
          return `${item.text}`;
        })
        .join(" ");

      const startTime = formatTime(word.start / 1000);
      const endTime = formatTime(word.end / 1000);
      eventsStr.push(
        `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,{\\1c&H${textPastColor}&}${text}`
      );
    }
  }

  const header = `
  [Script Info]
; Script generated by cliptext
WrapStyle: 0
ScaledBorderAndShadow: yes
Collisions: Normal
PlayResX: 1920
PlayResY: 1080
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${font},${fontSize},&H00${"000000"},&H00${"000000"},&H0${outlineColor},&H0000000,1,0,0,0,100.0,100.0,0.0,0.0,1,6,0,2,10,10,150,1

    [Events]
    Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`;

  return `${header}\n${eventsStr.join("\n")}`;
}

export function replaceColors(
  text: string,
  textPastColor: string,
  currentColor: string,
  futureColor: string
) {
  const regex = /\{[^}]+\}/g;
  let matchCount = 0;
  return text.replace(regex, (match) => {
    if (matchCount < [textPastColor, currentColor, futureColor].length) {
      return `{\\1c&H${[textPastColor, currentColor, futureColor][matchCount++]}&}`;
    }
    return match;
  });
}
