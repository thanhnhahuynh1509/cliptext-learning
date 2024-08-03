import { SERVER_ENDPOINT } from "@/config/server-config";
import { Font } from "@/types/font-type";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

export function formatDuration(time: number) {
  if (!time) {
    return "0:00";
  }
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);

  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

export async function getFileFromUrl(url: string, name: string) {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, { type: "video/mp4" });
}

export function getSelectedSpans() {
  const selection = window.getSelection();
  if (selection?.rangeCount === 0) {
    return [];
  }

  const range = selection?.getRangeAt(0);
  const selectedSpans: any[] = [];

  // Helper function to recursively find all span elements within a range
  function findSpans(node: any) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (range?.intersectsNode(node)) {
        let parent = node.parentNode;
        while (parent && parent !== document) {
          if (parent.tagName === "SPAN") {
            selectedSpans.push(parent);
            break;
          }
          parent = parent.parentNode;
        }
      }
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        findSpans(node.childNodes[i]);
      }
    }
  }

  // Start finding spans from the common ancestor container of the range
  findSpans(range?.commonAncestorContainer);

  // Remove duplicates
  const uniqueSpans = Array.from(new Set(selectedSpans));
  return uniqueSpans;
}

export function getSelectedSpanIds() {
  const spans = getSelectedSpans();
  const ids = spans.map((span) => span.getAttribute("data-id"));
  return ids;
}

export const captureFrame = async (
  objectUrl?: string,
  captureTime = 5,
  width: number = 150,
  height: number = 84.38
): Promise<string | undefined> => {
  return await new Promise<string>((resolve) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = document.createElement("video");

    if (!objectUrl) return undefined;

    video.src = objectUrl;
    video.currentTime = captureTime;
    video.onloadeddata = () => {
      canvas.width = width;
      canvas.height = height;
      context?.drawImage(video, 0, 0, width, height);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
      video.remove();
      canvas.remove();
    };
  });
};

export function loadFont(fontStyle: string, fontFamily: string) {
  const fontsStyleNode = document.getElementById(fontFamily);
  if (fontsStyleNode) {
    document.body.removeChild(fontsStyleNode);
  }
  const newStyle = document.createElement("style");
  newStyle.id = fontFamily;
  newStyle.appendChild(document.createTextNode(fontStyle));
  document.body.appendChild(newStyle);
}

export function addFontToDom(fonts: Font[]) {
  for (const font of fonts) {
    const fontStyle = `
          @font-face {
            font-family: '${font.fontFamily}';
            src: url('${SERVER_ENDPOINT + "/" + font.url}');
          }
        `;
    loadFont(fontStyle, font.fontFamily);
  }
}

export function toBGR(hex: string) {
  if (hex.length !== 6) {
    throw new Error("Invalid color format");
  }

  let r = hex.slice(0, 2);
  let g = hex.slice(2, 4);
  let b = hex.slice(4, 6);

  return b + g + r;
}
