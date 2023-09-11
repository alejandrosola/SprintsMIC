import { create } from "zustand";

type AppState = {
  repo: Repo | null;
  setRepo: (repo: Repo | null) => void;
};

type Repo = {
  name: string;
  stargazers_count: number;
};

const useAppState = create<AppState>((set) => ({
  repo: null,
  setRepo: (repo) => set({ repo }), // Allow assigning null
}));

export default useAppState;
