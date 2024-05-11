"use client";

import React, { useCallback } from "react";
import Footer from "./footer";
import Preview from "./preview";
import { Project, Status } from "@/types/project-types";
import { useUser } from "@clerk/nextjs";
import ContextMenuProject from "./context-menu-project";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

const ProjectCard = ({
  id,
  kind,
  url,
  uploadType,
  name,
  createdAt,
  authorId,
  authorName,
  status,
  duration,
}: Project) => {
  const { user } = useUser();
  let isToastShowing = false;
  const resetToastShowing = useDebounceCallback(() => {
    isToastShowing = false;
  }, 1000);

  const labelCreatedUser = authorId === user?.id ? "You" : authorName;

  const onOpenProject = () => {
    if (status === Status.Pending) {
      if (!isToastShowing) {
        isToastShowing = true;
        toast.info(`"${name}" is processing.`);
      } else {
        resetToastShowing();
      }
    }
  };

  return (
    <ContextMenuProject projectId={id} projectName={name}>
      <div
        className="group aspect-[100/127] rounded-lg border flex flex-col overflow-hidden cursor-pointer"
        onClick={onOpenProject}
      >
        <Preview id={id} url={url} kind={kind} status={status} />
        <Footer
          id={id}
          name={name}
          createdAt={createdAt}
          createdBy={labelCreatedUser}
        />
      </div>
    </ContextMenuProject>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <>
      <div className="group aspect-[100/127] rounded-lg border flex flex-col overflow-hidden animate-pulse">
        <div className="group relative flex-1 bg-slate-200 w-full h-full overflow-hidden flex items-center justify-center"></div>
        <div className="py-4 pl-4 pr-2 h-[100px]">
          <div className="flex items-start justify-between w-full gap-x-8">
            <h2 className="text-foreground font-medium text-base flex-1 line-clamp-2 h-8 bg-slate-200"></h2>
          </div>

          <p className="text-muted-foreground h-3 bg-slate-200 font-normal text-[12px] mt-2 opacity-100 pointer-events-auto transition"></p>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
