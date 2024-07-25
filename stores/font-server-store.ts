import { CaptionStyle } from "@/types/caption-style-type";
import { Font } from "@/types/font-type";
import { create } from "zustand";

interface IFontServerStore {
  fonts?: Font[];
  setFonts: (fonts?: Font[]) => void;
  getActiveFontByCaption: (
    fonts?: Font[],
    caption?: CaptionStyle
  ) => Font | undefined;
}

export const useFontServer = create<IFontServerStore>((set) => ({
  setFonts: (fonts?: Font[]) => {
    set({ fonts: fonts });
  },

  getActiveFontByCaption: (
    fonts?: Font[],
    caption?: CaptionStyle
  ): Font | undefined => {
    return fonts?.find((font) => font.id === caption?.fontId);
  },
}));
