"use client";

import React, { useEffect } from "react";
import ProjectCard, { ProjectCardSkeleton } from "./_components/project-card";
import EmptyProject from "./_components/empty-project";
import { list, listByRoomId } from "@/api/project";
import { useUser } from "@clerk/nextjs";
import { useProjects } from "@/stores/projects-store";
import { useRooms } from "@/stores/rooms-store";

const DashboardPage = () => {
  const { user } = useUser();
  const { currentRoom } = useRooms();
  const { projects, setProjects } = useProjects();

  useEffect(() => {
    async function init() {
      const projects = await listByRoomId(currentRoom?.id!);
      setProjects(projects);
    }

    init();
  }, [currentRoom?.id, setProjects]);

  if (projects == undefined) {
    return (
      <div className="gap-4 project 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    );
  } else if (!projects.length) {
    return <EmptyProject />;
  }

  return (
    <div className="gap-4 project 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default DashboardPage;
