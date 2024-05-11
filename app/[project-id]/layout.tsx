import React from "react";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  return <div className="w-full h-full bg-slate-100">{children}</div>;
};

export default ProjectLayout;
