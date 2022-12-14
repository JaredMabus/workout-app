import axios from "../../lib/axios";
import { FormValues } from "./useForm";

const instance = axios.create({
  withCredentials: true,
  validateStatus: (status: number) => {
    return status < 600;
  },
});

export const AccountApi = async (values: Partial<FormValues>) => {
  const response = await instance.put("account/", values);
  return response;
};

export const uploadImage = async (file: FileList | null | any) => {
  try {
    if (file === null) return;
    const data = new FormData();
    data.append("files", file[0]);
    const response = await instance.put("/upload/avatar", data);
    return response;
  } catch (err) {
    console.log(err);
  }
};
