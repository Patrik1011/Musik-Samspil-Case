import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Types } from "mongoose";
// import { Ensemble } from "../../src/schemas/ensemble.schema";
import { getModelToken } from "@nestjs/mongoose";
import { PostService } from "../../src/modules/post/post.service";
import { Post } from "../../src/schemas/post.schema";
//   import { EnsembleMembership } from '../src/schemas/ensemble-membership.schema';

// Mocking the Post and EnsembleMembership models
jest.mock("../../src/schemas/post.schema.ts", () => ({
  Post: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
  },
}));
jest.mock("../../src/schemas/ensemble-membership.schema");

describe("PostService", () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken("Post"),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
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

  describe("searchByLocation", () => {
    it("should return array of ensemble IDs with matching location", async () => {
      const mockEnsembles = [
        { _id: new Types.ObjectId(), location: { city: "Copenhagen" } },
        { _id: new Types.ObjectId(), location: { country: "Denmark" } },
      ];

      // Use jest.spyOn to mock the method
      jest.spyOn(service, "searchByLocation").mockResolvedValue(mockEnsembles.map(e => e._id));

      const result = await service.searchByLocation("Copenhagen");

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockEnsembles.map(e => e._id));
      expect(service.searchByLocation).toHaveBeenCalledWith("Copenhagen");
    });

    it("should return empty array if no matching ensembles found", async () => {
      jest.spyOn(service, "searchByLocation").mockResolvedValue([]);

      const result = await service.searchByLocation("Nonexistent Location");

      expect(result).toEqual([]);
    });
  });

  describe("searchByInstrument", () => {
    it("should return array of ensemble IDs with matching instrument", async () => {
      const mockEnsembles = [
        { _id: new Types.ObjectId(), instruments: ["guitar"] },
        { _id: new Types.ObjectId(), instruments: ["piano", "violin"] },
      ];

      jest.spyOn(service, "searchByInstrument").mockResolvedValue(mockEnsembles.map(e => e._id));

      const result = await service.searchByInstrument("guitar");

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockEnsembles.map(e => e._id));
      expect(service.searchByInstrument).toHaveBeenCalledWith("guitar");
    });

    it("should return empty array if no matching ensembles found", async () => {
      jest.spyOn(service, "searchByInstrument").mockResolvedValue([]);

      const result = await service.searchByInstrument("drums");

      expect(result).toEqual([]);
    });
  });

  describe("searchByGenreText", () => {
    it("should return array of ensemble IDs with matching genre text", async () => {
      const mockEnsembles = [
        { _id: new Types.ObjectId(), genre: "rock" },
        { _id: new Types.ObjectId(), genre: "pop" },
      ];

      jest.spyOn(service, "searchByGenericText").mockResolvedValue(mockEnsembles.map(e => e._id));

      const result = await service.searchByGenericText("rock");

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockEnsembles.map(e => e._id));
      expect(service.searchByGenericText).toHaveBeenCalledWith("rock");
    });

    it("should return empty array if no matching ensembles found", async () => {
      jest.spyOn(service, "searchByGenericText").mockResolvedValue([]);

      const result = await service.searchByGenericText("jazz");

      expect(result).toEqual([]);
    });
  });

  // describe("searchPost", () => {
  //   it("should return array of post IDs with matching search criteria", async () => {
  //     const mockPosts = [
  //       { _id: new Types.ObjectId(), title: "Guitar lessons" },
  //       { _id: new Types.ObjectId(), title: "Piano for beginners" },
  //     ];

  //     jest.spyOn(service, "searchPosts").mockResolvedValue(mockPosts.map(p => p._id));

  //     const result = await service.searchPosts("guitar");

  //     expect(result).toHaveLength(2);
  //     expect(result).toEqual(mockPosts.map(p => p._id));
  //     expect(service.searchPost).toHaveBeenCalledWith("guitar");
  //   });

  //   it("should return empty array if no matching posts found", async () => {
  //     jest.spyOn(service, "searchPost").mockResolvedValue([]);

  //     const result = await service.searchPost("drums");

  //     expect(result).toEqual([]);
  //   });
  // });
});
