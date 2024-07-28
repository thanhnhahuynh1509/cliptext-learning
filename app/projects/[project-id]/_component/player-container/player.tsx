"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useProjects } from "@/stores/projects-store";
import { Kind } from "@/types/project-types";
import { useTranscript } from "@/stores/transcript-store";
import JASSUB from "jassub";
import { generateASS } from "@/lib/caption";
import { useGlobalToggleState } from "@/stores/global-toggle-state-store";
import { useCaptionStyles } from "@/stores/caption-style-store";
import { useFontServer } from "@/stores/font-server-store";
import { SERVER_ENDPOINT } from "@/config/server-config";

interface PlayerProps {
  onExpand: boolean;
  currentTime?: number;
  setCurrentTime: (time: number) => void;
}

const Player = ({ onExpand, currentTime, setCurrentTime }: PlayerProps) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const { currentProject } = useProjects();
  const { words } = useTranscript();
  const { objectUrl, setMediaRefCurrent } = useMediaPlayerRef();
  const { onCC } = useGlobalToggleState();
  const { activeCaptionStyle } = useCaptionStyles();
  const { fonts, getActiveFontByCaption } = useFontServer();

  const trackingNoRenderState = useMemo<{
    frameCallbackId: any | undefined;
    currentWord: HTMLSpanElement | undefined;
  }>(() => {
    return { frameCallbackId: undefined, currentWord: undefined };
  }, []);

  useEffect(() => {
    if (objectUrl) {
      mediaRef.current?.load();
    }
  }, [objectUrl]);

  useEffect(() => {
    console.log("change", activeCaptionStyle);

    const mediaElement = mediaRef.current;
    if (!mediaElement) {
      return;
    }
    const activeFont = getActiveFontByCaption(fonts, activeCaptionStyle);

    const availableFonts = {
      "liberation sans": "/fonts/default.woff2",
    } as any;

    for (const font of fonts ?? []) {
      availableFonts[font.fontFamily.toLowerCase()] =
        SERVER_ENDPOINT + "/" + font.url;
    }

    const renderer = new JASSUB({
      video: mediaElement,
      subContent: generateASS(
        words ?? [],
        activeFont?.fontFamily ?? "liberation sans",
        activeCaptionStyle
      ),
      workerUrl: new URL(
        "jassub/dist/jassub-worker.js",
        import.meta.url
      ).toJSON(),
      wasmUrl: new URL(
        "jassub/dist/jassub-worker.wasm",
        import.meta.url
      ).toJSON(),
      availableFonts: availableFonts,
      fallbackFont: "liberation sans",
      useLocalFonts: true,
    });

    return () => {
      renderer.destroy();
    };
  }, [
    words,
    activeCaptionStyle?.fontSize,
    activeCaptionStyle?.maxCharactersOnScreen,
    activeCaptionStyle?.fontId,
  ]);

  useEffect(() => {
    const words = document.querySelectorAll(".word");
    if (trackingNoRenderState.currentWord) {
      trackingNoRenderState.currentWord.classList.remove("bg-blue-600");
      trackingNoRenderState.currentWord.classList.remove("text-white");
      trackingNoRenderState.currentWord.classList.remove("current-word");
    }
    for (let i = 0; i < words.length; i++) {
      const start = parseInt(words[i].getAttribute("data-start")!);
      const end = parseInt(words[i].getAttribute("data-end")!);
      if (
        currentTime &&
        currentTime >= start / 1000 &&
        currentTime <= end / 1000
      ) {
        words[i].classList.add("bg-blue-600");
        words[i].classList.add("text-white");
        words[i].classList.add("current-word");
        trackingNoRenderState.currentWord = words[i] as HTMLSpanElement;
        break;
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (mediaRef.current) {
      setMediaRefCurrent(mediaRef.current);
    }
  }, [setCurrentTime, setMediaRefCurrent]);

  useEffect(() => {
    if (!onCC) {
      document.querySelector(".JASSUB")?.classList.add("hidden");
    } else {
      document.querySelector(".JASSUB")?.classList.remove("hidden");
    }
  }, [onCC]);

  useEffect(() => {
    return () => {
      clearInterval(trackingNoRenderState.frameCallbackId);
    };
  }, []);

  return (
    <div className="w-full relative">
      <motion.div
        animate={{
          height: `${!onExpand && currentProject?.kind === Kind.Video ? "250px" : "auto"}`,
        }}
        id="container"
        className={`w-full`}
      >
        {currentProject?.kind === Kind.Video && (
          <video
            id="media-player"
            className={`bg-slate-200 w-full h-full aspect-[16/9] object-container ${onExpand ? "rounded-md" : "rounded-sm"}`}
            controls={true}
            ref={mediaRef}
            onPlay={(e) => {
              trackingNoRenderState.frameCallbackId = setInterval(
                () => {
                  setCurrentTime(mediaRef.current?.currentTime ?? 0);
                },
                (1 / 24) * 1000
              );
            }}
            onPause={() => {
              clearInterval(trackingNoRenderState.frameCallbackId);
            }}
          >
            <source src={objectUrl} />
          </video>
        )}

        {currentProject?.kind === Kind.Audio && (
          <audio
            id="media-player"
            className={`w-full`}
            controls={true}
            ref={mediaRef}
            onPlay={(e) => {
              trackingNoRenderState.frameCallbackId = setInterval(
                () => {
                  setCurrentTime(mediaRef.current?.currentTime ?? 0);
                },
                (1 / 24) * 1000
              );
            }}
            onPause={() => {
              clearInterval(trackingNoRenderState.frameCallbackId);
            }}
          >
            <source src={objectUrl} />
          </audio>
        )}
      </motion.div>
    </div>
  );
};

export default Player;
