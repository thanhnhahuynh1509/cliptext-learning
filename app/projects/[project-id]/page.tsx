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
import { addFontToDom, captureFrame, loadFont } from "@/lib/utils";
import { Kind } from "@/types/project-types";
import { listSystemFont } from "@/api/font";
import {
  createCaptionStyle,
  listCaptionStyleByUserId,
} from "@/api/caption-style";
import { useUser } from "@clerk/nextjs";
import { useFontServer } from "@/stores/font-server-store";
import { useCaptionStyles } from "@/stores/caption-style-store";
import { createDefaultCaption } from "@/types/caption-style-type";

interface ProjectPageProps {
  params: {
    "project-id": string;
  };
}

const ProjectPage = ({ params }: ProjectPageProps) => {
  const projectId = params["project-id"];
  const { currentProject, setCurrentProject } = useProjects();
  const { setFonts } = useFontServer();
  const { setCaptionStyles, setActiveCaption } = useCaptionStyles();
  const { user } = useUser();
  const {
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
  const [onLoading, setOnLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setOnLoading(true);
        const response = await getById(projectId);
        const data = await getDataById(projectId);
        const fonts = await listSystemFont();
        const captionStyles = await listCaptionStyleByUserId(user?.id ?? "0");

        if (!captionStyles?.length) {
          const caption = createDefaultCaption(
            fonts?.find((font) => font.id)?.id ?? 1,
            user!.id,
            user!.fullName!
          );
          const captionResponse = await createCaptionStyle(caption);
          captionStyles.push(captionResponse);
        }
        addFontToDom(fonts);
        setFonts(fonts);
        setCaptionStyles(captionStyles);
        setActiveCaption(response?.captionId, captionStyles);

        setCurrentProject(response);
        setWords(data.words);
        setUtterances(data.utterances);
        setChapters(data.chapters);
        setSpeakerMap(data.speakers);
        setEdits(data.edits);

        const mediaResponse = await fetch(SERVER_ENDPOINT + "/" + response.url);
        const blobData = await mediaResponse.blob();
        const objectBlobUrl = URL.createObjectURL(blobData);
        setObjectUrl(objectBlobUrl);

        if (response?.kind === Kind.Video) {
          const chapterPreviews: any = {};
          for (const chapter of data.chapters ?? []) {
            const result = await captureFrame(
              objectBlobUrl,
              chapter.start / 1000
            );
            if (result) {
              chapterPreviews[chapter.id] = result;
            }
          }

          const editPreviews: any = {};
          for (const edit of data.edits ?? []) {
            const result = await captureFrame(
              objectBlobUrl,
              edit?.words[0].start / 1000
            );
            if (result) {
              editPreviews[edit.id] = result;
            }
          }

          localStorage.setItem(
            "projectPreviewContainer",
            JSON.stringify({ chapters: chapterPreviews, edits: editPreviews })
          );
        }
      } catch (e) {
        setNotfound(true);
      } finally {
        setOnLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      init();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        resetTranscript();
      }

      localStorage.removeItem("projectPreviewContainer");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (notfound) {
    notFound();
  }

  if (!currentProject) {
    return <Loading />;
  }

  if (onLoading) {
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
