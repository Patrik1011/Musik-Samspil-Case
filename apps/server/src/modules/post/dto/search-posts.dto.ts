import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { PostType } from "../../../utils/types/enums";
import { Types } from "mongoose";

export class SearchPostsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @IsOptional()
  @IsMongoId()
  ensembleId?: string;
}

export type MongoSearchPostsDto = Partial<
  Omit<SearchPostsDto, "title" | "description"> & {
    title?: string | { $regex: string; $options: string };
    description?: string | { $regex: string; $options: string };
    ensemble_id?: { $in: Types.ObjectId[] };
  }
>;
