"use client";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link2, LoaderCircle } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { useCreateProjectModal } from "@/stores/create-project-modal-store";
import { getInfo } from "@/server/youtube-download";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useRooms } from "@/stores/rooms-store";
import { useProjects } from "@/stores/projects-store";
import stream from "stream";
import { Kind, Project, Status, UploadType } from "@/types/project-types";
import { saveYoutube } from "@/api/project";
import { useCaptionStyles } from "@/stores/caption-style-store";

const YoutubeUploadForm = () => {
  const [value, setValue] = useDebounceValue("", 500);
  const [id] = useState(uuid());
  const { user } = useUser();
  const { currentRoom } = useRooms();
  const { isCreating, setIsCreating, setOpen } = useCreateProjectModal();
  const { add } = useProjects();
  const { captionStyles, getDefaultCaption } = useCaptionStyles();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClick = async () => {
    try {
      toast.success("Start uploading your media...");
      setIsCreating(true);
      setOpen(true);
      const youtubeId = getYouTubeId(value);
      if (!youtubeId) {
        toast.error("Youtube video url is not valid!");
        return;
      }
      const infoStr = await getInfo(value);
      const info = JSON.parse(infoStr ?? "");
      const videoDetails = info.info.videoDetails;
      const project: Project = {
        id: id,
        name: videoDetails.title,
        uploadType: UploadType.Youtube,
        kind: Kind.Video,
        url: value,
        createdAt: Date.now(),
        authorId: user!.id,
        authorName: user!.fullName!,
        status: Status.Pending,
        duration: info.info.formats[0].approxDurationMs / 1000,
        roomId: currentRoom?.id!,
        thumbnail: info.thumbnail.url,
        captionId: getDefaultCaption(captionStyles)?.id,
      };

      const response = await saveYoutube(project);
      add(response);
      setOpen(false);
      toast.success("Uploading successfully! Your clip is processing...");
    } catch (e) {
      toast.error(
        "Something went wrong! Please try again or contact supports. Thanks"
      );
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (!value) return;

    const youtubeId = getYouTubeId(value);

    if (!youtubeId) {
      toast.error("Youtube video url is not valid!");
      return;
    }
  }, [value]);

  return (
    <div className="w-full min-h-[200px] flex flex-col gap-y-4 relative">
      <div className="w-full relative">
        <Link2 className="w-4 h-4 absolute top-1/2 left-4 -translate-y-1/2" />
        <Input
          className="w-full pl-10"
          placeholder="Enter url here"
          onChange={onChange}
        />
      </div>

      {getYouTubeId(value) && (
        <div className="flex gap-x-2 flex-col gap-y-4">
          <iframe
            className="w-full  object-cover aspect-[16/9]"
            src={`https://www.youtube.com/embed/${getYouTubeId(value)}`}
            id="frame"
          ></iframe>

          <div className="flex flex-col gap-y-2 items-center w-full">
            <Button onClick={onClick} className="w-full">
              {isCreating && (
                <LoaderCircle className="mr-2 w-4 h-4 animate-spin" />
              )}
              {isCreating ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function getYouTubeId(url: string) {
  // Regular expression pattern to match YouTube video URLs
  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube embedded video URLs
  const embeddedRegex = /(?:embed|v)\/([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube short URLs
  const shortRegex =
    /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube shorts URLs
  const shortsRegex =
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;

  // Check if the URL matches any of the patterns and extract the video ID
  const match =
    url.match(youtubeRegex) ||
    url.match(embeddedRegex) ||
    url.match(shortRegex) ||
    url.match(shortsRegex);

  // Return the video ID if found, otherwise return null
  return match ? match[1] : null;
}

export default YoutubeUploadForm;
