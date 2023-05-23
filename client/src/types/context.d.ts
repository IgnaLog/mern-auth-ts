export type AuthContextType = {
  auth: any;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
};
