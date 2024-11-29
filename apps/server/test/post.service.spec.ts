import {
  InternalServerErrorException,
  NotFoundException,
  // ForbiddenException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Types } from "mongoose";
import { PostService } from "../src/modules/post/post.service";
import { Post } from "../src/schemas/post.schema";
//   import { EnsembleMembership } from '../src/schemas/ensemble-membership.schema';

// Mocking the Post and EnsembleMembership models
jest.mock("../src/modules/post/post.service");
jest.mock("../src/schemas/ensemble-membership.schema");

describe("PostService", () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('create', () => {
  //   it('should create a post successfully', async () => {
  //     const userId = new Types.ObjectId().toHexString();
  //     const ensembleId = new Types.ObjectId().toHexString();
  //     const createPostDto = { title: 'New Post', content: 'This is a new post.' };
  //     const mockPost = { ...createPostDto, ensemble_id: ensembleId, author_id: userId };

  //     (Post.create as jest.Mock).mockResolvedValue(mockPost);

  //     const result = await service.create(createPostDto, userId, ensembleId);

  //     expect(result).toEqual(mockPost);
  //     expect(Post.create).toHaveBeenCalledWith({
  //       ...createPostDto,
  //       ensemble_id: new Types.ObjectId(ensembleId),
  //       author_id: new Types.ObjectId(userId),
  //     });
  //   });

  //   it('should throw InternalServerErrorException on error', async () => {
  //     const userId = new Types.ObjectId().toHexString();
  //     const ensembleId = new Types.ObjectId().toHexString();
  //     const createPostDto = { title: 'New Post', content: 'This is a new post.' };

  //     (Post.create as jest.Mock).mockRejectedValue(new Error('Database error'));

  //     await expect(service.create(createPostDto, userId, ensembleId)).rejects.toThrow(
  //       InternalServerErrorException,
  //     );
  //   });
  // });

  describe("getAllPosts", () => {
    it("should return all posts", async () => {
      const mockPosts = [
        { title: "Post 1", content: "Content 1", ensemble_id: "1", author_id: "1" },
        { title: "Post 2", content: "Content 2", ensemble_id: "2", author_id: "2" },
      ];

      (Post.find as jest.Mock).mockResolvedValue(mockPosts);

      const result = await service.getAllPosts();

      expect(result).toEqual(mockPosts);
      expect(Post.find).toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException on error", async () => {
      (Post.find as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(service.getAllPosts()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("getPostById", () => {
    it("should return a post by ID", async () => {
      const postId = new Types.ObjectId().toHexString();
      const mockPost = { title: "Post 1", content: "Content 1", ensemble_id: "1", author_id: "1" };

      (Post.findById as jest.Mock).mockResolvedValue(mockPost);

      const result = await service.getPostById(postId);

      expect(result).toEqual(mockPost);
      expect(Post.findById).toHaveBeenCalledWith(postId);
    });

    it("should throw NotFoundException if post not found", async () => {
      const postId = new Types.ObjectId().toHexString();

      (Post.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getPostById(postId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("getPostsByUserId", () => {
    it("should return posts by user ID", async () => {
      const userId = new Types.ObjectId().toHexString();
      const mockPosts = [
        { title: "Post 1", content: "Content 1", ensemble_id: "1", author_id: userId },
        { title: "Post 2", content: "Content 2", ensemble_id: "2", author_id: userId },
      ];

      (Post.find as jest.Mock).mockResolvedValue(mockPosts);

      const result = await service.getPostsByUserId(userId);

      expect(result).toEqual(mockPosts);
      expect(Post.find).toHaveBeenCalledWith({ author_id: userId });
    });

    it("should throw InternalServerErrorException on error", async () => {
      const userId = new Types.ObjectId().toHexString();

      (Post.find as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(service.getPostsByUserId(userId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  // describe('deletePost', () => {
  //   it('should delete a post if the user is the author or the ensemble host', async () => {
  //     const postId = new Types.ObjectId().toHexString();
  //     const userId = new Types.ObjectId().toHexString();
  //     const mockPost = { author_id: userId, ensemble_id: '1' };
  //     const mockMembership = { is_host: true };

  //     (Post.findById as jest.Mock).mockResolvedValue(mockPost);
  //     (EnsembleMembership.exists as jest.Mock).mockResolvedValue(mockMembership);

  //     const result = await service.deletePost(postId, userId);

  //     expect(result).toEqual({ message: 'Post deleted successfully' });
  //     expect(Post.findById).toHaveBeenCalledWith(postId);
  //     expect(EnsembleMembership.exists).toHaveBeenCalledWith({
  //       ensemble: mockPost.ensemble_id,
  //       member: userId,
  //       is_host: true,
  //     });
  //     expect(mockPost.deleteOne).toHaveBeenCalled();
  //   });

  //   it('should throw ForbiddenException if the user is neither the author nor the host', async () => {
  //     const postId = new Types.ObjectId().toHexString();
  //     const userId = new Types.ObjectId().toHexString();
  //     const mockPost = { author_id: new Types.ObjectId().toHexString(), ensemble_id: '1' };

  //     (Post.findById as jest.Mock).mockResolvedValue(mockPost);
  //     (EnsembleMembership.exists as jest.Mock).mockResolvedValue(null);

  //     await expect(service.deletePost(postId, userId)).rejects.toThrow(ForbiddenException);
  //   });

  //   it('should throw NotFoundException if post is not found', async () => {
  //     const postId = new Types.ObjectId().toHexString();
  //     const userId = new Types.ObjectId().toHexString();

  //     (Post.findById as jest.Mock).mockResolvedValue(null);

  //     await expect(service.deletePost(postId, userId)).rejects.toThrow(NotFoundException);
  //   });
  // });
});
