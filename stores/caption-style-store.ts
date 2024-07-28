import { CaptionStyle } from "@/types/caption-style-type";
import { create } from "zustand";

interface ICaptionStylesStore {
  captionStyles?: CaptionStyle[];
  activeCaptionStyle?: CaptionStyle;
  setCaptionStyles: (captionStyles?: CaptionStyle[]) => void;
  getDefaultCaption: (
    captionStyles?: CaptionStyle[]
  ) => CaptionStyle | undefined;

  setActiveCaption: (
    captionId?: number,
    captionStyles?: CaptionStyle[]
  ) => void;
  updateActiveCaption: (captionStyles?: CaptionStyle) => void;
}

export const useCaptionStyles = create<ICaptionStylesStore>((set) => ({
  setCaptionStyles: (captionStyles?: CaptionStyle[]) => {
    set({ captionStyles });
  },

  getDefaultCaption: (captionStyles?: CaptionStyle[]) => {
    return captionStyles?.find((caption) => caption.isDefault);
  },

  setActiveCaption: (captionId?: number, captionStyles?: CaptionStyle[]) => {
    set({
      activeCaptionStyle:
        captionStyles?.find((caption) => caption.id === captionId) ??
        captionStyles?.find((caption) => caption.isDefault),
    });
  },

  updateActiveCaption: (captionStyles?: CaptionStyle) => {
    set({ activeCaptionStyle: captionStyles });
  },
}));
