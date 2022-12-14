import axios from "../../lib/axios";
import { FormValues } from "./useForm";

const instance = axios.create({
  withCredentials: true,
  validateStatus: (status: number) => {
    // Set to less than 600 for custom error handling
    return status < 600;
  },
});

export const LoginApi = async (values: Omit<FormValues, "showPassword">) => {
  const response = await instance.post("account/login", values);
  return response;
};
