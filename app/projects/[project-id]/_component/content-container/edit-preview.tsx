import { captureFrame, formatDuration } from "@/lib/utils";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface EditPreviewProps {
  id: string;
  start: number;
  end: number;
}

const EditPreview = ({ id, start, end }: EditPreviewProps) => {
  const { objectUrl } = useMediaPlayerRef();
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    if (objectUrl) {
      const previewKey = `preview_edit_${id}`;
      const preview = localStorage.getItem(previewKey);
      if (!preview) {
        captureFrame(objectUrl, start / 1000).then((result) => {
          setImageSrc(result);
          if (result) {
            localStorage.setItem(previewKey, result);
          }
        });
      } else {
        setImageSrc(preview);
      }
    }
  }, [id, objectUrl, start]);

  return (
    <div className="w-[150px] aspect-[16/9] bg-gray-800 rounded-sm relative">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="Chapter Preview"
          className="top-0 left-0 w-full aspect-[16/9] rounded-sm"
          fill
        />
      )}

      <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center opacity-100 gap-y-4">
        <span className="flex items-center justify-center px-2 py-1 rounded-md bg-black/50 text-white text-[12px]">
          {formatDuration(end / 1000 - start / 1000)}
        </span>
      </div>
    </div>
  );
};

export default EditPreview;
