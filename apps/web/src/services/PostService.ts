import { deleteRequest, getRequest, postRequest } from "../utils/api";
import { Instrument } from "../enums/Instrument";

export interface Post {
  _id: string;
  title: string;
  description: string;
  website_url: string;
  type: string;
}

export interface PostDetails extends Post {
  author_id: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  ensemble_id: {
    location: {
      city: string;
      country: string;
      address: string;
    };
    _id: string;
    name: string;
    description: string;
    open_positions: Instrument[];
    is_active: boolean;
    updatedAt: string;
  };
  created_at: string;
}

export interface CreatePostInput extends Record<string, string> {
  title: string;
  description: string;
  website_url: string;
  type: string;
}

export const postService = {
  createPost: async (data: CreatePostInput, ensembleId: string): Promise<Post> => {
    const response = await postRequest(`/post/${ensembleId}`, data);
    return response as Post;
  },

  getPosts: async (): Promise<PostDetails[]> => {
    const response = await getRequest("/post");
    return response as PostDetails[];
  },

  getPostById: async (id: string): Promise<PostDetails> => {
    const response = await getRequest(`/post/${id}`);
    return response as PostDetails;
  },

  getPostsByUserId: async (): Promise<PostDetails[]> => {
    const response = await getRequest("/post/user/posts");
    return response as PostDetails[];
  },

  deletePost: async (id: string): Promise<void> => {
    await deleteRequest(`/post/${id}`);
  },

  getLatestPosts: async (): Promise<PostDetails[]> => {
    const response = await getRequest("/post/latest");
    return response as PostDetails[];
  },
};
