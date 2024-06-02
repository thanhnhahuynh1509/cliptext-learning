"use client";

import React, { useEffect, useState } from "react";
import { getById, getDataById } from "@/api/project";
import Loading from "@/components/loading";
import { notFound } from "next/navigation";
import ContentContainer from "./_component/content-container";
import PlayerContainer from "./_component/player-container";
import { SERVER_ENDPOINT } from "@/config/server-config";
import { useProjects } from "@/stores/projects-store";
import { useTranscript } from "@/stores/transcript-store";
import { useMediaPlayerRender } from "@/stores/media-player-render-store";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";

interface ProjectPageProps {
  params: {
    "project-id": string;
  };
}

const ProjectPage = ({ params }: ProjectPageProps) => {
  const projectId = params["project-id"];
  const { currentProject, setCurrentProject } = useProjects();
  const {
    edits,
    chapters,
    setWords,
    setSpeakerMap,
    setChapters,
    setUtterances,
    resetTranscript,
    setEdits,
  } = useTranscript();
  const { setCurrentTime, currentTime } = useMediaPlayerRender();
  const { objectUrl, setObjectUrl } = useMediaPlayerRef();

  const [notfound, setNotfound] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await getById(projectId);
        const data = await getDataById(projectId);

        setCurrentProject(response);
        setWords(data.words);
        setUtterances(data.utterances);
        setChapters(data.chapters);
        setSpeakerMap(data.speakers);
        setEdits(data.edits);

        const mediaResponse = await fetch(SERVER_ENDPOINT + "/" + response.url);
        const blobData = await mediaResponse.blob();
        setObjectUrl(URL.createObjectURL(blobData));
      } catch (e) {
        setNotfound(true);
      }
    };

    init();
  }, [
    projectId,
    setChapters,
    setCurrentProject,
    setEdits,
    setObjectUrl,
    setSpeakerMap,
    setUtterances,
    setWords,
  ]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        resetTranscript();
      }

      for (const chapter of chapters ?? []) {
        localStorage.removeItem(`preview_chapter_${chapter.id}`);
      }

      for (const edit of edits ?? []) {
        localStorage.removeItem(`preview_edit_${edit.id}`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (notfound) {
    notFound();
  }

  if (!currentProject) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full gap-x-8">
        <PlayerContainer
          setCurrentTime={setCurrentTime}
          currentTime={currentTime}
        />
        <ContentContainer />
      </div>
    </div>
  );
};

export default ProjectPage;
