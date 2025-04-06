import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

function useToast(defaultDuration = 3000): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = defaultDuration): string => {
      const id = Date.now().toString();
      
      const newToast: Toast = {
        id,
        message,
        type,
        duration,
      };
      
      setToasts((prevToasts) => [...prevToasts, newToast]);
      
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
      
      return id;
    },
    [defaultDuration]
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return { toasts, showToast, hideToast, clearToasts };
}

export default useToast;
