import React, { createContext, useContext, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

interface NotificationContextProps {
  showMessage: (
    message: string,
    variant?: "default" | "destructive",
  ) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const showMessage = (
    message: string,
    variant: "default" | "destructive" = "default",
  ) => {
    toast({
      description: message,
      variant: variant,
    });
  };

  return (
    <NotificationContext.Provider value={{ showMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
