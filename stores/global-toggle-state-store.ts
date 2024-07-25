import { create } from "zustand";

interface IGlobalToggleState {
  onExpand: boolean;
  onTranscriptEditMode: boolean;
  onCC: boolean;

  setOnExpand: (onExpand: boolean) => void;
  setOnTranscriptEditMode: (onEditMode: boolean) => void;
  setOnCC: (onCC: boolean) => void;
}

export const useGlobalToggleState = create<IGlobalToggleState>((set) => ({
  onExpand: false,
  onTranscriptEditMode: false,
  onCC: true,

  setOnExpand: (onExpand: boolean) => {
    set({ onExpand });
  },
  setOnTranscriptEditMode: (onEditMode: boolean) => {
    set({ onTranscriptEditMode: onEditMode });
  },
  setOnCC: (onCC: boolean) => {
    set({ onCC: onCC });
  },
}));
