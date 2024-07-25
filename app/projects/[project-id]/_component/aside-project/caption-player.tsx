import { SERVER_ENDPOINT } from "@/config/server-config";
import { generateASS } from "@/lib/caption";
import { useCaptionStyles } from "@/stores/caption-style-store";
import { useFontServer } from "@/stores/font-server-store";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useTranscript } from "@/stores/transcript-store";
import JASSUB from "jassub";
import React, { useEffect, useRef } from "react";

const CaptionPlayer = () => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const { objectUrl } = useMediaPlayerRef();
  const { activeCaptionStyle } = useCaptionStyles();
  const { fonts, getActiveFontByCaption } = useFontServer();
  const { words } = useTranscript();

  useEffect(() => {
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

    mediaElement.currentTime = mediaElement.currentTime;

    return () => {
      renderer.destroy();
    };
  }, [
    activeCaptionStyle?.fontSize,
    activeCaptionStyle?.maxCharactersOnScreen,
    activeCaptionStyle?.fontId,
    fonts,
    getActiveFontByCaption,
    words,
    activeCaptionStyle,
  ]);

  return (
    <div id="container" className="max-w-[1200px] relative">
      <video
        id="media-player"
        className={`bg-slate-200 w-full h-full aspect-[16/9] object-container rounded-md`}
        controls={true}
        ref={mediaRef}
      >
        <source src={objectUrl} />
      </video>
    </div>
  );
};

export default CaptionPlayer;
