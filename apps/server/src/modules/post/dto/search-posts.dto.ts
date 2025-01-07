import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { PostType } from "../../../utils/types/enums";

export class SearchPostsDto {
  @IsOptional()
  @IsString()
  genericText?: string | { $regex: string; $options: string };

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
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType | { $regex: string; $options: string };

  @IsOptional()
  @IsMongoId()
  ensembleId?: string;
}

export type MongoSearchPostsDto = Partial<
  Omit<SearchPostsDto, "title" | "description"> & {
    title?: string | { $regex: string; $options: string };
    description?: string | { $regex: string; $options: string };
    type?: string | { $regex: string; $options: string };
    ensemble_id?: { $in: Types.ObjectId[] };
    instrument?: string | { $regex: string; $options: string };
    $or?: Array<
      Partial<
        Pick<MongoSearchPostsDto, "title" | "description" | "type" | "instrument" | "ensemble_id">
      >
    >;
  }
>;
