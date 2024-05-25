import { cn, formatDuration } from "@/lib/utils";
import { Kind, Project } from "@/types/project-types";
import { Clapperboard, Headphones } from "lucide-react";
import React from "react";
import { Jost } from "next/font/google";

const jostFont = Jost({
  subsets: ["latin"],
  weight: "400",
});

interface ChaptersProps {
  chapters: any[];
  objectUrl?: string;
  project: Project;
}

const Chapters = ({ chapters, objectUrl, project }: ChaptersProps) => {
  return (
    <div className="flex flex-col gap-y-4 mt-7">
      {chapters.map((chapter: any, idx: number) => {
        return (
          <div
            key={idx}
            className="flex gap-x-4 items-start cursor-pointer hover:bg-slate-200 hover:rounded-md transition p-4"
          >
            {!objectUrl && (
              <div className="w-[150px] aspect-[16/9] bg-slate-800 relative">
                {project.kind === Kind.Audio && (
                  <Headphones className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                )}

                {project.kind === Kind.Video && (
                  <Clapperboard className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                )}

                <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center opacity-100 transition gap-y-4">
                  <span className="flex items-center justify-center px-2 py-1 rounded-md bg-black/50 text-white text-[12px]">
                    {formatDuration(chapter.start / 1000)}
                  </span>
                </div>
              </div>
            )}
            {objectUrl && (
              <div className="w-[150px] aspect-[16/9] bg-gray-800 relative">
                {project.kind === Kind.Audio && (
                  <Headphones className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                )}

                {project.kind === Kind.Video && (
                  <video className="w-full aspect-[16/9]" controls={false}>
                    <source src={objectUrl + `#t=${chapter.start / 1000}`} />
                  </video>
                )}

                <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center opacity-100 transition gap-y-4">
                  <span className="flex items-center justify-center px-2 py-1 rounded-md bg-black/50 text-white text-[12px]">
                    {formatDuration(chapter.start / 1000)}
                  </span>
                </div>
              </div>
            )}
            <div className="w-full flex flex-col gap-y">
              <p>{chapter.gist}</p>

              <p
                key={idx}
                className={cn(
                  "text-muted-foreground w-full",
                  jostFont.className
                )}
              >
                {chapter?.summary}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chapters;
