import { create } from 'zustand';

interface CreateProjectStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useCreateProject = create<CreateProjectStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useCreateProject;
