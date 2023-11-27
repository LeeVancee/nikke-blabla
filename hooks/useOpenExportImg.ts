import { create } from 'zustand';

interface UseOpenExportImg {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useOpenExportImg = create<UseOpenExportImg>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useOpenExportImg;
