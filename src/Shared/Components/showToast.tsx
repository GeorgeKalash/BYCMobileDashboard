import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  hideProgressBar: true,
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  position: "bottom-right",
};

const toastMessages = {
  success: {
    message: "Your data has been saved successfully!",
    options: {
      ...defaultOptions,
      style: { backgroundColor: "green", color: "white" },
    },
  },
  postSuccess: {
    message: "Your data has been posted successfully!",
    options: {
      ...defaultOptions,
      style: { backgroundColor: "green", color: "white" },
    },
  },
  delete: {
    message: "Your data has been deleted",
    options: {
      ...defaultOptions,
      style: { backgroundColor: "red", color: "white" },
    },
  },
  error: {
    message: "Something went wrong!",
    options: {
      ...defaultOptions,
      style: { backgroundColor: "red", color: "white" },
    },
  },
  warning: {
    message: "Please check your inputs.",
    options: {
      ...defaultOptions,
      style: { backgroundColor: "orange", color: "black" },
    },
  },
  update: {
    message: "Your data has been updated.",
    options: {
      ...defaultOptions,
      style: { backgroundColor: "blue", color: "white" },
    },
  },
};

export const showToast = (
  key: keyof typeof toastMessages,
  overrideMessage?: string,
) => {
  const toastData = toastMessages[key];
  if (toastData) {
    toast(overrideMessage || toastData.message, toastData.options);
  } else {
    console.error(`Toast key "${key}" not found!`);
  }
};

export default toastMessages;