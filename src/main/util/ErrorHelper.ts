import { toast } from 'react-hot-toast';

export const catchToast =
  <T = never>(id: string): ((error: unknown) => Promise<T>) =>
  (error) => {
    toast.error(String(error), { id });
    return Promise.reject<T>(error);
  };
