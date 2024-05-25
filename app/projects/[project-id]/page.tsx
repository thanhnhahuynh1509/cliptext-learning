"use client";

import React, { useEffect, useState } from "react";
import data from "./data.json";
import { getById, getDataById } from "@/api/project";
import Loading from "@/components/loading";
import { Project } from "@/types/project-types";
import { notFound } from "next/navigation";
import ContentContainer from "./_component/content-container";
import PlayerContainer from "./_component/player-container";
import { SERVER_ENDPOINT } from "@/config/server-config";

interface ProjectPageProps {
  params: {
    "project-id": string;
  };
}

const ProjectPage = ({ params }: ProjectPageProps) => {
  const projectId = params["project-id"];
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [notfound, setNotfound] = useState(false);
  const [words, setWords] = useState([]);
  const [utterances, setUtterances] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await getById(projectId);
        const data = await getDataById(projectId);
        setProject(response);
        setWords(data.words as any);
        setUtterances(data.utterances as any);
        setChapters(data.chapters as any);
        console.log(SERVER_ENDPOINT + "/" + response.url);
        const mediaResponse = await fetch(SERVER_ENDPOINT + "/" + response.url);
        const blobData = await mediaResponse.blob();
        setObjectUrl(URL.createObjectURL(blobData));
      } catch (e) {
        setNotfound(true);
      }
    };

    init();
  }, [projectId]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  if (notfound) {
    notFound();
  }

  if (!project) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full gap-x-8">
        <PlayerContainer
          project={project}
          objectUrl={objectUrl}
          utterances={utterances}
        />

        <ContentContainer
          project={project}
          objectUrl={objectUrl}
          chapters={chapters}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
