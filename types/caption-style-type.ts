export interface CaptionStyle {
  id: number;
  name: string;
  pastColor: string;
  currentColor: string;
  futureColor: string;
  outlineColor: string;
  fontId: number;
  fontSize: number;
  maxCharactersOnScreen: number;
  authorId?: string;
  authorName?: string;
  createdAt: number;
  isDefault: boolean;
}

export const DEFAULT_PAST_COLOR = "FFFFFF";
export const DEFAULT_CURRENT_COLOR = "FFFFFF";
export const DEFAULT_FUTURE_COLOR = "707070";
export const DEFAULT_OUTLINE_COLOR = "000000";
export const DEFAULT_FONT_SIZE = 70;
export const DEFAULT_MAX_CHARACTERS_ON_SCREEN = 20;

export function createDefaultCaption(
  fontId: number,
  userId: string,
  userFullName: string
): CaptionStyle {
  return {
    id: -1,
    createdAt: Date.now(),
    currentColor: DEFAULT_CURRENT_COLOR,
    fontId: fontId,
    fontSize: DEFAULT_FONT_SIZE,
    futureColor: DEFAULT_FUTURE_COLOR,
    isDefault: true,
    maxCharactersOnScreen: DEFAULT_MAX_CHARACTERS_ON_SCREEN,
    name: "Default",
    outlineColor: DEFAULT_OUTLINE_COLOR,
    pastColor: DEFAULT_PAST_COLOR,
    authorId: userId,
    authorName: userFullName,
  };
}
