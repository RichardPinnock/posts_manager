import { getPosts } from "@/actions/posts-actions";
import Table from "./components/Table";
import { Metadata } from "next";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "CRUD de Posts",
  description: "Gestión de Posts",
};

export default async function Page() {
  const posts = await getPosts();
  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-3 items-end mb-4">
        <Newspaper className="size-6 md:size-12" />
        <h1 className="text-xl md:text-3xl font-bold"> Posts </h1>
      </div>
      <Table posts={posts} />
    </div>
  );
}
