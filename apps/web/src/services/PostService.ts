import { getRequest, postRequest } from "../utils/api";

export interface Post {
  _id: string;
  title: string;
  description: string;
  website_url: string;
  type: string;
}

export interface CreatePostInput extends Record<string, any> {
  title: string;
  description: string;
  website_url: string;
  type: string;
}

export const postService = {
  createPost: async (
    data: CreatePostInput,
    ensembleId: string,
  ): Promise<Post> => {
    const response = await postRequest(`/post/${ensembleId}`, data);
    return response as Post;
  },

  getPosts: async (): Promise<Post[]> => {
    const response = await getRequest("/post");
    return response as Post[];
  },
};
