import { create } from 'zustand';

interface AddNikkeWindowState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}
const useAddNikkeWindow = create<AddNikkeWindowState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useAddNikkeWindow;
