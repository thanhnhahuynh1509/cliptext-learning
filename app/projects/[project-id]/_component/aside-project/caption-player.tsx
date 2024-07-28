import { SERVER_ENDPOINT } from "@/config/server-config";
import { generateASS, replaceColors } from "@/lib/caption";
import { toBGR } from "@/lib/utils";
import { useCaptionStyles } from "@/stores/caption-style-store";
import { useFontServer } from "@/stores/font-server-store";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useTranscript } from "@/stores/transcript-store";
import {
  CaptionStyle,
  DEFAULT_CURRENT_COLOR,
  DEFAULT_FONT_NAME,
  DEFAULT_FONT_SIZE,
  DEFAULT_FUTURE_COLOR,
  DEFAULT_OUTLINE_COLOR,
  DEFAULT_PAST_COLOR,
} from "@/types/caption-style-type";
import JASSUB from "jassub";
import React, { useEffect, useRef, useState } from "react";

interface CaptionPlayerProps {
  caption?: CaptionStyle;
}

const CaptionPlayer = ({ caption }: CaptionPlayerProps) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [renderer, setRenderer] = useState<JASSUB>();
  const { objectUrl } = useMediaPlayerRef();
  const { fonts, getActiveFontByCaption } = useFontServer();
  const { words } = useTranscript();
  const activeFont = getActiveFontByCaption(fonts, caption);

  const textPastColor = toBGR(caption?.pastColor ?? DEFAULT_PAST_COLOR);
  const textFutureColor = toBGR(caption?.futureColor ?? DEFAULT_FUTURE_COLOR);
  const textCurrentColor = toBGR(
    caption?.currentColor ?? DEFAULT_CURRENT_COLOR
  );

  useEffect(() => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) {
      return;
    }

    const availableFonts = {
      [DEFAULT_FONT_NAME]: "/fonts/default.woff2",
    } as any;

    for (const font of fonts ?? []) {
      availableFonts[font.fontFamily.toLowerCase()] =
        SERVER_ENDPOINT + "/" + font.url;
    }

    const renderer = new JASSUB({
      video: mediaElement,
      subContent: generateASS(
        words ?? [],
        activeFont?.fontFamily ?? DEFAULT_FONT_NAME,
        caption
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

    mediaElement.currentTime -= 1 / 24;
    mediaElement.currentTime += 1 / 24;
    setRenderer(renderer);

    return () => {
      renderer.destroy();
      setRenderer(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caption?.maxCharactersOnScreen, words]);

  useEffect(() => {
    if (!renderer) {
      return;
    }

    const mediaElement = mediaRef.current;
    if (!mediaElement) {
      return;
    }

    renderer.getStyles((error, event) => {
      renderer.addFont(SERVER_ENDPOINT + "/" + activeFont?.url);
      renderer.getEvents((error, event) => {
        let i = 0;
        for (const item of event as any) {
          renderer.setEvent(
            {
              ...item,
              Text: replaceColors(
                item.Text,
                textPastColor,
                textCurrentColor,
                textFutureColor
              ),
            },
            i
          );
          i += 1;
        }
      });
      renderer.setStyle(
        {
          ...event,
          FontName: activeFont?.fontFamily ?? DEFAULT_FONT_NAME,
          FontSize: caption?.fontSize ?? DEFAULT_FONT_SIZE,
          OutlineColour: parseInt(
            (caption?.outlineColor ?? DEFAULT_OUTLINE_COLOR) + "00",
            16
          ),
        },
        1
      );
      mediaElement.currentTime -= 1 / 24;
      mediaElement.currentTime += 1 / 24;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    caption?.fontSize,
    caption?.fontId,
    fonts,
    getActiveFontByCaption,
    caption,
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
