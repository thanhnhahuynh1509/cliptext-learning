import { Kind, Project } from "@/types/project-types";
import React, { useEffect, useRef } from "react";

interface PlayerProps {
  project: Project;
  objectUrl?: string;
}

const Player = ({ project, objectUrl }: PlayerProps) => {
  const mediaRef = useRef<any>();

  useEffect(() => {
    if (objectUrl) {
      mediaRef.current.load();
    }
  }, [objectUrl]);

  return (
    <div className="w-full relative">
      {project.kind === Kind.Video && (
        <video
          className="w-full aspect-[16/9] object-contain"
          controls={true}
          ref={mediaRef}
        >
          <source src={objectUrl} />
        </video>
      )}
      {project.kind === Kind.Audio && (
        <audio
          className="w-full aspect-[16/9] object-contain"
          controls={true}
          ref={mediaRef}
        >
          <source src={objectUrl} />
        </audio>
      )}
    </div>
  );
};

export default Player;
