import { create } from "zustand";
import { PopupType } from "@/types/popup";

export type MessageType = "OK" | "ERROR" | "WARNING";

interface PopupState {
  popup: PopupType;
  message: {
    msg: {
      title: string;
      body: string;
    };
    type: MessageType;
  };
  openPopup: (popup: PopupType) => void;
  openMessage: (
    msg: { title: string; body: string },
    type?: MessageType
  ) => void;
  closePopup: () => void;
}

const usePopupStore = create<PopupState>((set) => ({
  popup: null,
  message: {
    msg: {
      title: "",
      body: "",
    },
    type: "OK",
  },
  openPopup: (popup) => set({ popup }),
  openMessage: ({ title, body }, type = "OK") =>
    set({ popup: "Message", message: { msg: { title, body }, type } }),
  closePopup: () => set({ popup: null }),
}));

export default usePopupStore;
