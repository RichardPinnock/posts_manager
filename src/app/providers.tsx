"use client";

import { PostsProvider } from "@/app/context/PostsContext";
import { NotificationProvider } from "@/app/context/NotificationContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PostsProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </PostsProvider>
  );
}
