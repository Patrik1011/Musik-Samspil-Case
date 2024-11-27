import { getRequest, postRequest } from "../utils/api";

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
    open_positions: string[];
    is_active: boolean;
    updatedAt: string;
  };
  created_at: string;
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

  getPostById: async (id: string): Promise<PostDetails> => {
    const response = await getRequest(`/post/${id}`);
    console.log(response);
    return response as PostDetails;
  },

  getPostsByUserId: async (): Promise<Post[]> => {
    const response = await getRequest("/post/user/posts");
    return response as Post[];
  },
};
