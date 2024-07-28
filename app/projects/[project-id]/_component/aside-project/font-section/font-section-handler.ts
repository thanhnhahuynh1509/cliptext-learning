import { CaptionStyle } from "@/types/caption-style-type";

export const handleOnFontValueChange = (
  caption: CaptionStyle | undefined,
  value: string,
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void
) => {
  if (!caption) return;
  const intValue = parseInt(value);
  if (caption.fontId == intValue) return;

  caption.fontId = intValue;
  afterSetValueCallback(caption);
};

export const handleChangeFontSize = (
  event: any,
  caption: CaptionStyle | undefined,
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void
) => {
  if (!caption) return;
  if (!event.currentTarget.value) {
    event.currentTarget.value = `${caption.fontSize}`;
    return;
  }
  const value = Math.max(parseInt(event.currentTarget.value), 10);
  if (caption.fontSize == value) return;

  caption.fontSize = value;
  event.currentTarget.value = value;
  afterSetValueCallback(caption);
};

export const handleKeyDownFontSize = (
  e: React.KeyboardEvent<HTMLInputElement>,
  caption: CaptionStyle | undefined,
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void
) => {
  if (e.key == "Enter") {
    e.preventDefault();
    handleChangeFontSize(e, caption, afterSetValueCallback);
    e.currentTarget.blur();
    return;
  }
};

export const handleChangeMaxCharactersOnScreen = (
  event: any,
  caption: CaptionStyle | undefined,
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void
) => {
  if (!caption) return;
  if (!event.currentTarget.value) {
    event.currentTarget.value = `${caption.maxCharactersOnScreen}`;
    return;
  }
  const value = Math.max(parseInt(event.currentTarget.value), 10);
  if (caption.maxCharactersOnScreen == value) return;

  caption.maxCharactersOnScreen = value;
  event.currentTarget.value = value;
  afterSetValueCallback(caption);
};

export const handleKeyDownMaxCharactersOnScreen = (
  event: React.KeyboardEvent<HTMLInputElement>,
  caption: CaptionStyle | undefined,
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void
) => {
  if (event.key == "Enter") {
    event.preventDefault();
    handleChangeMaxCharactersOnScreen(event, caption, afterSetValueCallback);
    event.currentTarget.blur();
    return;
  }
};
