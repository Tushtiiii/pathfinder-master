'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';

type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastInstance = ToastOptions & { id: number };

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const typeStyles: Record<ToastType, string> = {
  info: 'bg-blue-600/95 text-white shadow-lg shadow-blue-500/30',
  success: 'bg-green-600/95 text-white shadow-lg shadow-green-500/30',
  warning: 'bg-amber-500/95 text-white shadow-lg shadow-amber-400/30',
  error: 'bg-red-600/95 text-white shadow-lg shadow-red-500/30',
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const timersRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(({ message, type = 'info', duration = 3500 }: ToastOptions) => {
    if (!message) return;
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type, duration }]);

    const timer = window.setTimeout(() => removeToast(id), duration);
    timersRef.current.set(id, timer);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed top-6 right-6 z-[2000] flex flex-col gap-3 max-w-xs sm:max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto overflow-hidden rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-transform duration-200 ${typeStyles[toast.type ?? 'info']}`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
