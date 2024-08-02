import { api } from ".";

export type TypeHolder = {
    id: number;
    name: string,
    cpf: string,
    email: string,
    phone: string,
    project_id: string,
    created_by: string,
    updated_by: string,
}

export const getHolders = async () => {
    return await api.get("holders");
  };

export const setHolder = async (holder: TypeHolder) => {
    return await api.post("holders/", holder);
}

export const removeHolder = async (id: number) => {
    return await api.delete(`holders/${id}`);
}

export const createHolder = async (holder: any) => {
    return await api.post("holders/", holder);
}

export const updateHolder = async (holder: any) => {
    return await api.put(`holders/${holder.id}/`, holder);
}