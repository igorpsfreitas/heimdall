import { api } from ".";

export type TypeProject = {
    id: number;
    name: string,
    started: null | string,
    finished: null | string,
    status: "in_progress" | "finished",
    created_by: string,
    updated_by: string,
}

export const getProjects = async () => {
    return await api.get("projects");
  };

export const setProject = async (project: TypeProject) => {
    return await api.post("projects/", project);
}

export const removeProject = async (id: number) => {
    return await api.delete(`projects/${id}`);
}

export const createProject = async (project: any) => {
    return await api.post("projects/", project);
}