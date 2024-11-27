import { getRequest, postRequest } from "../utils/api";
import { PostType } from "../enums/PostType.ts";

export interface Post {
  _id: string;
  title: string;
  description: string;
  website_url: string;
  type: PostType;
}

export interface CreatePostInput {
  title: string;
  description: string;
  website_url: string;
  type: PostType;
}

export const postService = {
  createPost: async (data: CreatePostInput, ensembleId: string): Promise<Post> => {
    const requestData = {
      title: data.title,
      description: data.description,
      website_url: data.website_url,
      type: data.type,
    };
    const response = await postRequest(`post/${ensembleId}`, requestData);
    return response as Post;
  },

  getPosts: async (): Promise<Post[]> => {
    const response = await getRequest("/post");
    return response as Post[];
  },
};
