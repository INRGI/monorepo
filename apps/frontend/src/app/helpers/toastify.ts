import { Bounce, Slide, toast } from 'react-toastify';

export const toastSuccess = (text: string) => {
  toast.success(text, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  });
};

export const toastCustom = (text: string) => {
  toast(text, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    transition: Slide,
  });
};

export const toastError = (text: string) => {
  toast.error(text, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  });
};

export const updateToast = (toastId: string | number, message: string) => {
  toast.update(toastId, {
    render: message,
    autoClose: false,
    closeButton: false,
  });
};