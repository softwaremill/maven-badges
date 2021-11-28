import { AxiosError } from "axios";

export const isAxiosError = (err: any): err is AxiosError =>
err && err.response && err.response.status;

export const extractAxiosErrorStatus = (err: AxiosError) => err.response?.status ?? 0;
