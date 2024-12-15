import { IsOptional, IsString, IsEnum, IsMongoId } from "class-validator";
import { PostType } from "../../../utils/types/enums";

export class SearchPostsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @IsOptional()
  @IsMongoId()
  ensembleId?: string;
}
