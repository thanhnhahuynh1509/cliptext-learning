import React from "react";
import data from "./data.json";

interface ProjectPageProps {
  params: {
    "project-id": string;
  };
}

const ProjectPage = ({ params }: ProjectPageProps) => {
  const projectId = params["project-id"];
  return (
    <div className="w-full h-full">
      <div className="w-[500px]">
        <video className="w-full aspect-[16/9]" controls />
      </div>
    </div>
  );
};

export default ProjectPage;
