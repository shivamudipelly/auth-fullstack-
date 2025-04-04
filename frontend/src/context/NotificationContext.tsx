import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "info";

interface NotificationOptions {
  timeout?: number;
  scrollDismiss?: boolean;
}

interface NotificationContextType {
  notify: (
    message: string,
    type?: NotificationType,
    options?: NotificationOptions
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

const typeColors: Record<NotificationType, string> = {
  success: "bg-green-100 text-green-800 border-green-400",
  error: "bg-red-100 text-red-800 border-red-400",
  info: "bg-blue-100 text-blue-800 border-blue-400",
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    timeout: number;
    scrollDismiss: boolean;
  } | null>(null);

  const notify = (
    message: string,
    type: NotificationType = "info",
    options?: NotificationOptions
  ) => {
    setNotification({
      message,
      type,
      timeout: options?.timeout ?? 2000,
      scrollDismiss: options?.scrollDismiss ?? true,
    });
  };

  const handleClose = () => setNotification(null);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(handleClose, notification.timeout);

    const handleScroll = () => {
      if (notification.scrollDismiss) handleClose();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 border rounded-md shadow-lg z-50 max-w-xs w-full transition-all duration-300 animate-fadeIn ${
            typeColors[notification.type]
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm">{notification.message}</span>
            <button
              onClick={handleClose}
              className="ml-4 text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
