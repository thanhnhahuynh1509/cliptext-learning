"use client";

import React, { useEffect } from "react";
import ProjectCard, { ProjectCardSkeleton } from "./_components/project-card";
import NewProjectButton from "./_components/new-project-button";
import EmptyProject from "./_components/empty-project";
import { list } from "@/api/project";
import { useUser } from "@clerk/nextjs";
import { useProjects } from "@/stores/projects-store";

const DashboardPage = () => {
  const { user } = useUser();
  const { projects, setProjects } = useProjects();

  useEffect(() => {
    async function init() {
      const projects = await list(user?.id ?? "");
      setProjects(projects);
    }

    init();
  }, [user?.id, setProjects]);

  if (projects == undefined) {
    return (
      <div className="grid grid-cols-6 gap-4">
        <NewProjectButton />
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
    <div className="gap-4 grid 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
      <NewProjectButton />
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          url={project.url}
          kind={project.kind}
          uploadType={project.uploadType}
          name={project.name}
          createdAt={project.createdAt}
          authorId={project.authorId}
          authorName={project.authorName}
          status={project.status}
          duration={project.duration}
        />
      ))}
    </div>
  );
};

export default DashboardPage;
