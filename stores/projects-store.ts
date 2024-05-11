import { Project } from "@/types/project-types";
import { create } from "zustand";

interface IProjectModal {
  projects: Project[] | undefined;
  setProjects: (projects: Project[]) => void;
  add: (project: Project) => void;
  update: (id: string, project: any) => void;
  delete: (id: string) => void;
}

export const useProjects = create<IProjectModal>((set) => {
  return {
    projects: undefined,
    setProjects: (projects: Project[]) => {
      set({ projects: projects });
    },
    add: (project) => {
      set((state) => {
        const projects = state.projects
          ? [...state.projects, project]
          : [project];
        return { projects: projects };
      });
    },
    update: (id: string, projectUpdated: any) => {
      set((state) => {
        const projects = state.projects?.map((project) => {
          if (project.id === id) {
            return { ...project, ...projectUpdated };
          }
          return project;
        });

        return { projects: projects };
      });
    },
    delete: (id: string) => {
      set((state) => {
        return {
          projects: state.projects?.filter((project) => project.id !== id),
        };
      });
    },
  };
});
