import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "@/actions/posts-actions";

interface Post {
  comments: any;
  id: number;
  title: string;
  body: string;
}

interface PostsContextProps {
  posts: Post[];
  selectedPost: Post | null;
  fetchPosts: () => Promise<void>;
  fetchPost: (id: number) => Promise<void>;
  addPost: (post: { title: string; body: string }) => Promise<void>;
  editPost: (
    id: number,
    post: { title: string; body: string }
  ) => Promise<void>;
  removePost: (id: number) => Promise<void>;
  selectPost: (post: Post | null) => void;
}

const PostsContext = createContext<PostsContextProps | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };
  const fetchPost = async (id: number) => {
    const response = await getPost(id);
    setSelectedPost(response);
  };

  const addPost = async (post: { title: string; body: string }) => {
    const response = await createPost(post);
    const newPost = response.data;
    setPosts([...posts, newPost]);
  };

  const editPost = async (
    id: number,
    post: { title: string; body: string }
  ) => {
    const updatedPost = await updatePost(id, post);
    setPosts(posts.map((p) => (p.id === id ? updatedPost.data : p)));
  };

  const removePost = async (id: number) => {
    await deletePost(id);
    setPosts(posts.filter((p) => p.id !== id));
  };

  const selectPost = (post: Post | null) => {
    setSelectedPost(post);
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        selectedPost,
        fetchPosts,
        fetchPost,
        addPost,
        editPost,
        removePost,
        selectPost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts debe usarse dentro de un PostsProvider");
  }
  return context;
};
