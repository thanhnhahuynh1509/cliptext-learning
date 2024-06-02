import { captureFrame, formatDuration } from "@/lib/utils";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useProjects } from "@/stores/projects-store";
import { Kind } from "@/types/project-types";
import { Chapter } from "@/types/transcript-types";
import { Headphones } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface PreviewChapterItemProps {
  chapter: Chapter;
}

const PreviewChapterItem = ({ chapter }: PreviewChapterItemProps) => {
  const { currentProject } = useProjects();
  const { objectUrl } = useMediaPlayerRef();
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    if (currentProject?.kind !== Kind.Audio) {
      const previewKey = `preview_chapter_${chapter.id}`;
      const preview = localStorage.getItem(previewKey);
      if (!preview) {
        captureFrame(objectUrl, chapter.start / 1000).then((result) => {
          setImageSrc(result);
          if (result) {
            localStorage.setItem(previewKey, result);
          }
        });
      } else {
        setImageSrc(preview);
      }
    }
  }, [chapter, currentProject?.kind, objectUrl]);

  return (
    <div className="w-[150px] aspect-[16/9] bg-gray-800 rounded-sm relative">
      {currentProject?.kind === Kind.Audio && (
        <Headphones className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
      )}

      {currentProject?.kind === Kind.Video && (
        <>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="Chapter Preview"
              className="top-0 left-0 w-full aspect-[16/9] rounded-sm"
              fill
            />
          )}
        </>
      )}

      <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center opacity-100 transition gap-y-4">
        <span className="flex items-center justify-center px-2 py-1 rounded-md bg-black/50 text-white text-[12px]">
          {formatDuration((chapter.end - chapter.start) / 1000)}
        </span>
      </div>
    </div>
  );
};

export default PreviewChapterItem;
