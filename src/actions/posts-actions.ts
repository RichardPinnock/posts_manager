import axios from "axios";

export async function getPosts() {
  // solo los primeros 40 posts
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts?_limit=40"
  );

  return response.data;
}

export const getPost = async (id: number) => {
  const postResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  const commentsResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );

  return {
    ...postResponse.data,
    comments: commentsResponse.data,
  };
};

export async function createPost(post: { title: string; body: string }) {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    post
  );
  return response;
}

export async function updatePost(
  id: number,
  post: { title: string; body: string }
) {
  const response = await axios.put(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    post
  );
  return response;
}

export async function deletePost(id: number) {
  const response = await axios.delete(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { params: { id } }
  );

  return response;
}
