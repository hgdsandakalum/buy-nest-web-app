import { create } from "zustand";

type State = {
  isLoading: boolean;
  pageName: string;
};
type Action = {
  setIsLoadingAction: (isLoading: boolean) => void;
  setpageNameAction: (pageName: string) => void;
};
const initialState: State = {
  isLoading: true,
  pageName: "/",
};

export const useAppStore = create<State & Action>((set) => ({
  ...initialState,
  setIsLoadingAction: (isLoading: boolean) => set({ isLoading: isLoading }),
  setpageNameAction: (pageName: string) => set({ pageName: pageName }),
}));
