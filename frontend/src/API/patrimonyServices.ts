import { api } from ".";

export type TypePatrimony = {
    id: number;
    name: string,
    listing_code: string,
    serial_number: string,
    description: string | null,
    observation: string | null,
    status: string,
    holder_id: number | null,
    project_id: number | null,
    created_by: number | string,
    updated_by: number | string,
}

export const getPatrimonies= async () => {
    return await api.get("patrimonies/");
  };

export const setPatrimony = async (holder: TypePatrimony) => {
    return await api.post("patrimonies/", holder);
}

export const removePatrimony = async (id: number) => {
    return await api.delete(`patrimonies/${id}`);
}

export const createPatrimony = async (holder: any) => {
    return await api.post("patrimonies/", holder);
}

export const updatePatrimony = async (holder: any) => {
    return await api.put(`patrimonies/${holder.id}/`, holder);
}